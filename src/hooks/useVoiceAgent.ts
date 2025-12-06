import { useState, useRef, useCallback, useEffect } from 'react';
import {
  getVoiceAgentWebSocketUrl,
  type VoiceAgentIncomingMessage,
  type VoiceAgentSettings,
} from '../api/voiceAgentApi';
import {
  requestMicrophoneAccess,
  createAudioContext,
  createAudioCapture,
  pcmToBase64,
  playPCMAudio,
  stopAudioPlayback,
  type AudioCaptureOptions,
} from '../utils/audioUtils';

export type VoiceAgentState =
  | 'idle'
  | 'connecting'
  | 'recording'
  | 'processing'
  | 'playing'
  | 'error';

export interface VoiceAgentCallbacks {
  onConversationText?: (text: string) => void;
  onError?: (error: string) => void;
  onStateChange?: (state: VoiceAgentState) => void;
}

export interface UseVoiceAgentOptions {
  settings?: VoiceAgentSettings;
  audioOptions?: AudioCaptureOptions;
  callbacks?: VoiceAgentCallbacks;
}

export interface UseVoiceAgentReturn {
  state: VoiceAgentState;
  isRecording: boolean;
  isConnected: boolean;
  conversationText: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  disconnect: () => void;
}

const DEFAULT_SETTINGS: VoiceAgentSettings = {
  audio_input_encoding: 'linear16',
  audio_input_sample_rate: 48000, // 48 kHz as required
  think_prompt: 'You are a helpful assistant.',
};

export function useVoiceAgent(
  options: UseVoiceAgentOptions = {}
): UseVoiceAgentReturn {
  const {
    settings = DEFAULT_SETTINGS,
    audioOptions = {},
    callbacks = {},
  } = options;

  const [state, setState] = useState<VoiceAgentState>('idle');
  const [conversationText, setConversationText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const captureControlRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const isRecordingRef = useRef(false); // Keep ref for callbacks that need current value
  const nextPlayTimeRef = useRef<number>(0); // Track scheduled playback time to prevent gaps/clicks
  const audioBufferRef = useRef<ArrayBuffer[]>([]); // Buffer for accumulating small chunks (like HTML implementation)
  // MIN_CHUNK_SIZE = ~400ms at 24kHz (like HTML implementation)
  // 24000 samples/sec * 0.4s * 2 bytes = 19200 bytes
  const MIN_CHUNK_SIZE = 19200;
  const connectionPromiseRef = useRef<Promise<WebSocket> | null>(null); // Track ongoing connection attempts
  const connectionTimeoutRef = useRef<number | null>(null); // Track connection timeout
  const settingsSentRef = useRef<boolean>(false); // Track if settings have been sent on current connection

  const updateState = useCallback(
    (newState: VoiceAgentState) => {
      setState(newState);
      callbacks.onStateChange?.(newState);
    },
    [callbacks]
  );

  const handleError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      updateState('error');
      callbacks.onError?.(errorMessage);
    },
    [callbacks, updateState]
  );

  const cleanup = useCallback(() => {
    // Stop audio capture
    if (captureControlRef.current) {
      captureControlRef.current.stop();
      captureControlRef.current = null;
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Clear connection timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }

    // Clear connection promise
    connectionPromiseRef.current = null;

    isRecordingRef.current = false;
  }, []);

  /**
   * Disconnect and close the WebSocket connection.
   * 
   * IMPORTANT: This should ONLY be called when:
   * 1. Component is unmounting (user navigates away/closes page)
   * 2. User explicitly ends the conversation
   * 
   * DO NOT call this when:
   * - Stopping recording (use stopRecording() instead)
   * - After receiving settings_applied (connection must stay open)
   * - After receiving any message (connection must stay open)
   * 
   * The WebSocket must remain open for the entire conversation duration
   * to allow multiple start/stop recording cycles.
   */
  const disconnect = useCallback(() => {
    
    cleanup();

    // Close WebSocket properly
    if (wsRef.current) {
      try {
        // CRITICAL: This is the ONLY place where we:
        // 1. Send {"type": "close"} message to server ✅
        // 2. Close the WebSocket connection ✅
        //
        // Called only when:
        // - Component unmounts (user navigates away/closes page)
        // - User explicitly disconnects
        //
        // NOT called when:
        // - stopRecording() is called
        // - settings_applied is received
        // - Any other message is received
        
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'close' }));
          // Give the server a moment to process the close message before closing the socket
          setTimeout(() => {
            if (wsRef.current) {
              wsRef.current.close(1000, 'Client disconnecting'); // Normal closure
            }
          }, 100);
        } else {
          // If not open, just close it
          wsRef.current.close();
        }
      } catch (e) {
        // Still try to close the socket even if sending failed
        if (wsRef.current) {
          wsRef.current.close();
        }
      }

      wsRef.current = null;
    }

    // Reset settings flag so new connection can send settings
    settingsSentRef.current = false;

    setIsConnected(false);
    isRecordingRef.current = false;
    setIsRecording(false);
    updateState('idle');
    setConversationText('');
    setError(null);
    
    // Reset audio scheduling
    nextPlayTimeRef.current = 0;
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    
  }, [cleanup, updateState]);

  const connectWebSocket = useCallback((): Promise<WebSocket> => {
    // If already connected and settings have been applied, return existing connection
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && settingsSentRef.current) {
      return Promise.resolve(wsRef.current);
    }

    // If connection is already in progress, return the existing promise
    // This prevents creating multiple WebSocket connections that would each send settings
    if (connectionPromiseRef.current) {
      return connectionPromiseRef.current;
    }

    const connectionPromise = new Promise<WebSocket>((resolve, reject) => {
      const wsUrl = getVoiceAgentWebSocketUrl();
      let isResolved = false;
      let isRejected = false;

      // Helper to ensure we only resolve/reject once
      const safeResolve = (value: WebSocket) => {
        if (!isResolved && !isRejected) {
          isResolved = true;
          connectionPromiseRef.current = null;
          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
          }
          resolve(value);
        }
      };

      const safeReject = (error: Error) => {
        if (!isResolved && !isRejected) {
          isRejected = true;
          connectionPromiseRef.current = null;
          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
          }
          reject(error);
        }
      };

      try {
        
        // Set binaryType to 'arraybuffer' to properly handle binary audio data
        const ws = new WebSocket(wsUrl);
        ws.binaryType = 'arraybuffer'; // This ensures binary data comes as ArrayBuffer, not Blob
        
        // Add connection timeout (10 seconds)
        connectionTimeoutRef.current = window.setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN && !isResolved && !isRejected) {
            ws.close();
            const errorMsg = `Connection timeout. Please ensure the backend server is running at ${wsUrl}`;
            handleError(errorMsg);
            safeReject(new Error(errorMsg));
          }
        }, 10000);

        ws.onopen = () => {
          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
          }
          setIsConnected(true);
          updateState('connecting');

          // CRITICAL: Send settings after connection - ONLY ONCE per WebSocket connection
          // Check if settings have already been sent to prevent duplicates
          if (settingsSentRef.current) {
            // If settings were already sent, the connection should already be ready
            // But if we're here, it means we have a new WebSocket, so reset the flag
            settingsSentRef.current = false;
          }

          // Send settings after connection - ONLY ONCE
          // After this, the WebSocket MUST stay open for the entire conversation
          // We will NOT close it after sending settings or receiving settings_applied
          try {
            ws.send(
              JSON.stringify({
                type: 'settings',
                settings,
              })
            );
            settingsSentRef.current = true; // Mark settings as sent
          } catch (e) {
            safeReject(new Error('Failed to send settings'));
          }
        };

        ws.onmessage = (event) => {
          try {
            // According to the API spec:
            // 1. Binary messages (audio) come as Blob or ArrayBuffer
            // 2. Text messages (JSON) come as string
            // Always check for binary FIRST before parsing JSON
            
            // Log EVERY message type to diagnose if messages are being received
            const messageType = typeof event.data;
            const isArrayBuffer = event.data instanceof ArrayBuffer;
            const isBlob = event.data instanceof Blob;
            const isString = typeof event.data === 'string';
            
            
            // Check if message is binary (audio data)
            // Binary messages are ArrayBuffer or Blob (per API spec)
            if (event.data instanceof Blob || event.data instanceof ArrayBuffer) {
              // Handle binary audio data
              // Convert Blob to ArrayBuffer if needed
              const bufferPromise = event.data instanceof ArrayBuffer
                ? Promise.resolve(event.data)
                : event.data.arrayBuffer();
              
              bufferPromise.then(async (buffer) => {
                // Validate incoming audio data
                if (buffer.byteLength === 0) {
                  return;
                }
                
                // Check if chunk size is reasonable
                // Typical Deepgram chunks: ~960 bytes (480 samples = 20ms at 24kHz)
                // Very small or very large chunks might indicate issues
                if (buffer.byteLength < 50) {
                } else if (buffer.byteLength > 10000) {
                }
                
                // MATCH HTML IMPLEMENTATION: Buffer chunks together before playing
                // This creates larger, more stable audio chunks for smoother playback
                audioBufferRef.current.push(buffer);
                const bufferedSize = audioBufferRef.current.reduce((sum, chunk) => sum + chunk.byteLength, 0);
                
                // Play when buffer reaches minimum size (~400ms) OR when we have 8+ chunks
                // This prevents long delays while also creating stable chunks
                if (bufferedSize >= MIN_CHUNK_SIZE || audioBufferRef.current.length >= 8) {
                  // Combine buffered chunks into one ArrayBuffer (like HTML implementation)
                  const combinedBuffer = new ArrayBuffer(bufferedSize);
                  const combinedView = new Uint8Array(combinedBuffer);
                  let offset = 0;
                  for (const chunk of audioBufferRef.current) {
                    combinedView.set(new Uint8Array(chunk), offset);
                    offset += chunk.byteLength;
                  }
                  
                  // Clear buffer and process the combined chunk
                  const chunkToPlay = combinedBuffer;
                  audioBufferRef.current = [];
                  
                  // Process the combined audio chunk
                  (async () => {
                // Ensure audio context exists and is running
                // Create one if it doesn't exist (for playback even when not recording)
                // CRITICAL: Try to create AudioContext at 24000 Hz to match audio sample rate
                // This prevents resampling artifacts that cause noise
                if (!audioContextRef.current) {
                  const targetSampleRate = 24000; // Match backend audio sample rate
                  let audioContext: AudioContext;
                  
                  try {
                    // Try to create AudioContext with 24000 Hz
                    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
                      sampleRate: targetSampleRate,
                      latencyHint: 'interactive',
                    });
                    
                    // Check if browser actually created it at the requested rate
                    if (audioContext.sampleRate === targetSampleRate) {
                      audioContextRef.current = audioContext;
                    } else {
                      // Browser ignored our request, use what it gave us
                      audioContextRef.current = audioContext;
                    }
                  } catch (e) {
                    // Browser doesn't support 24000 Hz, fall back to default
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
                      latencyHint: 'interactive',
                    });
                  }
                }

                const audioContext = audioContextRef.current;

                // CRITICAL: Resume audio context if suspended (browser autoplay policy)
                // Browsers require user interaction before allowing audio playback
                // Since user clicked the mic button, we should be able to resume
                if (audioContext.state === 'suspended') {
                  try {
                    await audioContext.resume();
                  } catch (resumeError) {
                    handleError('Audio playback blocked. Please click the mic button again to enable audio playback.');
                    return;
                  }
                }

                // Ensure context is running before playing
                if (audioContext.state !== 'running') {
                  try {
                    await audioContext.resume();
                  } catch (err) {
                    handleError('Cannot play audio - audio context is not active. Please interact with the page.');
                    return;
                  }
                }

                // Helper function to play next chunk from queue with proper scheduling
                const playNextChunk = (lastChunkEndTime?: number): void => {
                  if (audioQueueRef.current.length > 0) {
                    const nextBuffer = audioQueueRef.current.shift();
                    if (nextBuffer) {
                      isPlayingRef.current = true;
                      // Keep state as playing while playing queued audio
                      updateState('playing');
                      
                      // Calculate when to start next chunk (immediately after previous ends)
                      // This prevents gaps and clicks between chunks
                      const scheduledTime = lastChunkEndTime !== undefined 
                        ? lastChunkEndTime 
                        : audioContext.currentTime;
                      
                      playPCMAudio(audioContext, nextBuffer, 24000, scheduledTime)
                        .then(() => {
                          // Calculate when this chunk ends for next chunk scheduling
                          // Estimate duration: buffer size / sample rate
                          const estimatedDuration = nextBuffer.byteLength / 2 / 24000; // bytes / 2 (16-bit) / sample rate
                          const nextStartTime = scheduledTime + estimatedDuration;
                          // Recursively play next chunk with proper timing
                          playNextChunk(nextStartTime);
                        })
                        .catch((err) => {
                          isPlayingRef.current = false;
                          // Try to continue with next chunk even if this one failed
                          playNextChunk();
                        });
                    } else {
                      // Queue empty, we're done
                      isPlayingRef.current = false;
                      nextPlayTimeRef.current = 0;
                      if (isRecordingRef.current) {
                        updateState('recording');
                      } else {
                        updateState('idle');
                      }
                    }
                  } else {
                    // Queue empty, we're done
                    isPlayingRef.current = false;
                    nextPlayTimeRef.current = 0;
                    if (isRecordingRef.current) {
                      updateState('recording');
                    } else {
                      updateState('idle');
                    }
                  }
                };

                if (!isPlayingRef.current) {
                  isPlayingRef.current = true;
                  // System is speaking - set state to playing
                  // This takes priority over recording state
                  updateState('playing');
                  // Use OUTPUT sample rate (24000) for playback, not input sample rate
                  const outputSampleRate = 24000; // Deepgram TTS output sample rate
                  
                  // Calculate estimated duration for proper scheduling
                  const estimatedDuration = chunkToPlay.byteLength / 2 / outputSampleRate; // bytes / 2 (16-bit) / sample rate
                  const startTime = audioContext.currentTime;
                  nextPlayTimeRef.current = startTime + estimatedDuration;
                  
                  playPCMAudio(
                    audioContext,
                    chunkToPlay,
                    outputSampleRate,
                    startTime
                  )
                    .then(() => {
                      // Process queued audio if any with proper timing
                      playNextChunk(nextPlayTimeRef.current);
                    })
                    .catch((err) => {
                      isPlayingRef.current = false;
                      nextPlayTimeRef.current = 0;
                      // Try to play queued audio even if current chunk failed
                      playNextChunk();
                      const errorMsg = err instanceof Error ? err.message : 'Failed to play audio response';
                      handleError(`Audio playback error: ${errorMsg}. Please check your browser audio settings and ensure your speakers/headphones are working.`);
                    });
                } else {
                  // Queue audio if already playing
                  audioQueueRef.current.push(chunkToPlay);
                  // Ensure state is still playing
                  updateState('playing');
                }
                  })().catch((err) => {
                    handleError('Failed to process audio data from server');
                  });
                }
                // If not enough data yet, keep buffering - wait for more chunks
              }).catch((err) => {
                handleError('Failed to process audio data from server');
              });
              return;
            }

            // Handle JSON text messages (per API spec)
            // If not binary, it must be a text/string message
            if (typeof event.data !== 'string') {
              // If it's not a string and not binary, it might be binary data that wasn't detected
              // Try to handle it as binary
              if (event.data && typeof event.data === 'object' && 'byteLength' in event.data) {
                // Convert to ArrayBuffer and handle as audio
                const buffer = event.data instanceof ArrayBuffer 
                  ? event.data 
                  : new Uint8Array(event.data).buffer;
                // Process as audio (reuse the binary handling logic)
                // This is a fallback for edge cases
                return;
              }
              return;
            }

            // Validate string message before parsing
            const messageString = event.data.trim();
            
            // Check if message looks like JSON (starts with { or [)
            if (!messageString.startsWith('{') && !messageString.startsWith('[')) {
              // Check if it might be binary data sent as string
              if (messageString.length > 0) {
                const firstChar = messageString.charCodeAt(0);
                if (firstChar < 32 || firstChar > 126) {
                }
              }
              return;
            }

            // CRITICAL: Check for concatenated JSON messages BEFORE attempting to parse
            // This can happen if the server sends multiple messages in one WebSocket frame
            // Quick check: count opening braces to detect multiple objects
            const countCompleteObjects = (str: string): number => {
              let depth = 0;
              let count = 0;
              let inString = false;
              let escapeNext = false;
              
              for (let i = 0; i < str.length; i++) {
                const char = str[i];
                
                if (escapeNext) {
                  escapeNext = false;
                  continue;
                }
                
                if (char === '\\') {
                  escapeNext = true;
                  continue;
                }
                
                if (char === '"') {
                  inString = !inString;
                  continue;
                }
                
                if (!inString) {
                  if (char === '{') {
                    if (depth === 0) count++; // New object started
                    depth++;
                  }
                  if (char === '}') {
                    depth--;
                  }
                }
              }
              
              return count;
            };

            // Check if message contains multiple JSON objects BEFORE parsing
            const objectCount = countCompleteObjects(messageString);
            
            if (objectCount > 1) {
              
              // Split into separate messages
              const parts: string[] = [];
              let depth = 0;
              let start = 0;
              let inString = false;
              let escapeNext = false;
              
              for (let i = 0; i < messageString.length; i++) {
                const char = messageString[i];
                
                if (escapeNext) {
                  escapeNext = false;
                  continue;
                }
                
                if (char === '\\') {
                  escapeNext = true;
                  continue;
                }
                
                if (char === '"') {
                  inString = !inString;
                  continue;
                }
                
                if (!inString) {
                  if (char === '{') {
                    if (depth === 0) start = i; // Mark start of new object
                    depth++;
                  }
                  if (char === '}') {
                    depth--;
                    if (depth === 0) {
                      // Found complete JSON object
                      parts.push(messageString.substring(start, i + 1));
                      start = i + 1;
                    }
                  }
                }
              }
              
              // Add remaining part if any
              if (start < messageString.length) {
                const remaining = messageString.substring(start).trim();
                if (remaining) {
                  parts.push(remaining);
                }
              }
              
              // Parse each message separately
              for (let i = 0; i < parts.length; i++) {
                const part = parts[i].trim();
                if (part) {
                  try {
                    const parsed = JSON.parse(part);
                    handleJsonMessage(parsed);
                  } catch (e) {
                  }
                }
              }
              return; // Done processing concatenated messages
            }

            // Single message - parse normally
            let message: VoiceAgentIncomingMessage;
            try {
              message = JSON.parse(messageString);
              // Successfully parsed as single message
              handleJsonMessage(message);
              return;
            } catch (parseError) {
              
              // Still failed - log detailed error
              
              // Check if it might be binary data that was sent as text
              if (messageString.length > 0) {
                const firstChar = messageString.charCodeAt(0);
                if (firstChar < 32 || (firstChar > 126 && firstChar < 160)) {
                  return;
                }
              }
              
              // Only show error to user if it's a real JSON parsing issue
              // Don't show error for binary data that was incorrectly detected
              if (messageString.startsWith('{') || messageString.startsWith('[')) {
                handleError('Failed to parse server message');
              }
              return;
            }


          } catch (e) {
            handleError('Failed to process server message');
          }
        };

        // Helper function to handle JSON messages
        const handleJsonMessage = (message: VoiceAgentIncomingMessage) => {
          switch (message.type) {
            case 'settings_applied':
              
              // CRITICAL REQUIREMENTS:
              // 1. Keep WebSocket open after settings_applied ✅
              // 2. Do NOT send {"type": "close"} here ✅
              // 3. Do NOT call ws.close() here ✅
              // 4. Do NOT send settings again - they've been applied ✅
              // 
              // The WebSocket must remain open for:
              // - Sending audio chunks during recording
              // - Receiving agent audio responses
              // - Receiving conversation text
              // - Multiple start/stop recording cycles
              //
              // Only close when disconnect() is explicitly called:
              // - Component unmounts (user navigates away/closes page)
              // - User explicitly disconnects
              
              // Store the WebSocket reference when settings are applied
              wsRef.current = ws;
              // Settings have been applied, connection is ready
              // Keep settingsSentRef as true to prevent resending on reconnect
              safeResolve(ws);
              // ✅ CONFIRMED: We do NOT call ws.close() here - the connection stays open!
              break;

            case 'conversation_text':
              setConversationText(message.text);
              callbacks.onConversationText?.(message.text);
              break;

            case 'agent_started_speaking':
              // System is speaking - always show playing state
              // This takes priority over recording state
              updateState('playing');
              break;

            case 'agent_audio_done':
              // MATCH HTML IMPLEMENTATION: Play any remaining buffered audio
              if (audioBufferRef.current.length > 0) {
                const bufferedChunkCount = audioBufferRef.current.length; // Store count before clearing
                const bufferedSize = audioBufferRef.current.reduce((sum, chunk) => sum + chunk.byteLength, 0);
                const combinedBuffer = new ArrayBuffer(bufferedSize);
                const combinedView = new Uint8Array(combinedBuffer);
                let offset = 0;
                for (const chunk of audioBufferRef.current) {
                  combinedView.set(new Uint8Array(chunk), offset);
                  offset += chunk.byteLength;
                }
                
                // Clear buffer before queuing
                audioBufferRef.current = [];
                
                // Queue the remaining buffered audio
                audioQueueRef.current.push(combinedBuffer);
                
                // Start playing if not already playing (like HTML implementation)
                if (!isPlayingRef.current && audioQueueRef.current.length > 0) {
                  // Trigger playback by processing the queued chunk
                  // This will be handled by the next incoming audio chunk or we need to manually trigger
                  // For now, the queue will be processed when the next audio chunk arrives
                  // If this is the final chunk, it will be handled by the setTimeout below
                }
              }
              
              // System finished speaking
              // Check if we're still playing queued audio
              // If not, check if user is recording
              setTimeout(() => {
                // Small delay to check if more audio is coming
                if (!isPlayingRef.current) {
                  // No more audio playing
                  if (isRecordingRef.current) {
                    updateState('recording');
                  } else {
                    updateState('idle');
                  }
                }
                // If isPlayingRef.current is still true, more audio is coming, keep playing state
              }, 100);
              break;

            case 'error':
              handleError(message.text);
              break;

            case 'connection_closed':
              disconnect();
              break;

            default:
          }
        };

        ws.onerror = (error) => {
          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
          }
          
          const errorMsg = `Failed to connect to voice agent server at ${wsUrl}. Please ensure the backend server is running.`;
          handleError(errorMsg);
          safeReject(new Error(errorMsg));
        };

        ws.onclose = (event) => {
          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
          }
          
          setIsConnected(false);
          wsRef.current = null; // Clear the reference
          
          // If connection failed before opening, reject the promise
          if ((event.code === 1006 || event.code === 1005) && !isResolved && !isRejected) {
            const errorMsg = `Connection failed. Please ensure the backend server is running at ${wsUrl}`;
            handleError(errorMsg);
            safeReject(new Error(errorMsg));
          }

          // Only attempt reconnection if we were actively recording and it wasn't a normal closure
          // Code 1000 = normal closure (we initiated it via disconnect())
          // Code 1005 = no status (abnormal closure, might be network issue)
          // Code 1006 = abnormal closure (connection lost)
          if (isRecordingRef.current && event.code !== 1000) {
            reconnectTimeoutRef.current = window.setTimeout(() => {
              connectWebSocket()
                .then((newWs) => {
                  wsRef.current = newWs;
                  // Resume recording if we were recording
                  if (captureControlRef.current) {
                    captureControlRef.current.start();
                  }
                })
                .catch((err) => {
                  handleError('Failed to reconnect');
                });
            }, 2000);
          } else {
            // Normal closure (1000) means we explicitly disconnected - this is expected
            if (event.code === 1000) {
            }
            // Normal closure or not recording - just update state
            updateState('idle');
          }
        };

        // Don't set wsRef.current here - it will be set when the promise resolves
        // This prevents race conditions where wsRef might be accessed before settings_applied
      } catch (e) {
        connectionPromiseRef.current = null;
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
        reject(new Error('Failed to create WebSocket connection'));
      }
    });

    // Store the promise to prevent duplicate connections
    connectionPromiseRef.current = connectionPromise;
    return connectionPromise;
  }, [settings, callbacks, updateState, handleError]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);

      // Cleanup any existing connections
      if (isRecordingRef.current) {
        // Stop audio capture first
        if (captureControlRef.current) {
          captureControlRef.current.stop();
          captureControlRef.current = null;
        }

        // Stop media stream tracks
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }

        // Suspend audio context (don't close, so we can reuse it)
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.suspend().catch(() => {});
        }

        isRecordingRef.current = false;
        setIsRecording(false);
      }

      // Request microphone access
      updateState('connecting');
      const stream = await requestMicrophoneAccess(audioOptions);
      mediaStreamRef.current = stream;

      // Create audio context
      const sampleRate = settings.audio_input_sample_rate || 48000; // 48 kHz as required
      const audioContext = createAudioContext(sampleRate);
      audioContextRef.current = audioContext;

      // Resume audio context if suspended (required by some browsers)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // CRITICAL: Connect WebSocket and WAIT for settings_applied before starting audio capture
      // The WebSocket connection promise resolves when settings_applied is received
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        // Check if connection is already in progress to prevent duplicate connections
        if (connectionPromiseRef.current) {
          const ws = await connectionPromiseRef.current;
          wsRef.current = ws;
        } else {
          const ws = await connectWebSocket();
          // Store the WebSocket reference
          wsRef.current = ws;
        }
      } else {
      }

      // Verify WebSocket is still open before starting audio capture
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        throw new Error('WebSocket connection is not open');
      }

      // Create audio capture
      const captureControl = createAudioCapture(
        stream,
        audioContext,
        (pcmData) => {
          // Send audio data to server as binary (recommended format)
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            try {
              // Send raw PCM audio as binary data
              // This is the format Deepgram expects for linear16 audio
              wsRef.current.send(pcmData.buffer);
              // Log occasionally to avoid spam (every ~50 chunks = ~5 seconds at 100ms intervals)
              if (Math.random() < 0.02) {
              }
            } catch (e) {
              handleError('Failed to send audio data');
            }
          } else {
          }
        },
        100 // Send chunks every 100ms
      );

      captureControlRef.current = captureControl;
      captureControl.start();
      isRecordingRef.current = true;
      setIsRecording(true);
      updateState('recording');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start recording';
      handleError(errorMessage);
      cleanup();
    }
  }, [audioOptions, settings, connectWebSocket, updateState, handleError, cleanup]);

  const stopRecording = useCallback(() => {
    
    // Stop audio capture first
    if (captureControlRef.current) {
      captureControlRef.current.stop();
      captureControlRef.current = null;
    }

    // Stop media stream tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Suspend audio context (don't close, so we can reuse it)
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.suspend().catch(() => {});
    }

    // CRITICAL REQUIREMENTS:
    // 1. Do NOT send {"type": "close"} here ✅
    // 2. Do NOT close WebSocket here ✅
    // 3. Keep connection open for next recording ✅
    //
    // The WebSocket connection must stay open so the user can:
    // - Start recording again without reconnecting
    // - Continue the conversation
    // - Receive agent responses
    //
    // Only send {"type": "close"} and close WebSocket in disconnect() function

    isRecordingRef.current = false;
    setIsRecording(false);

    // Update state based on whether we're playing audio
    if (isPlayingRef.current) {
      updateState('playing');
    } else {
      updateState('idle');
    }
    
  }, [updateState]);

  // DIAGNOSTIC: Check browser's default AudioContext sample rate on mount
  // This helps identify if resampling (24kHz → 48kHz) is causing noise
  useEffect(() => {
    // Test what sample rate the browser will use by default
    try {
      const testContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        latencyHint: 'interactive',
      });
      const defaultRate = testContext.sampleRate;
      testContext.close();
      
    } catch (e) {
    }
  }, []);

  // Cleanup on unmount - only disconnect when component is actually unmounting
  // This ensures the WebSocket stays open for the entire conversation duration
  useEffect(() => {
    return () => {
      // Only disconnect when component unmounts (user navigates away or closes page)
      // This is the ONLY place where we should close the WebSocket during normal operation
      if (wsRef.current) {
        disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Intentionally omit disconnect from deps to avoid recreating this effect
    // The cleanup function captures the latest disconnect via closure
  }, []);

  return {
    state,
    isRecording,
    isConnected,
    conversationText,
    error,
    startRecording,
    stopRecording,
    disconnect,
  };
}
