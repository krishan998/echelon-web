// Audio utilities for voice agent

export interface AudioCaptureOptions {
  sampleRate?: number;
  channels?: number;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
}

const DEFAULT_SAMPLE_RATE = 24000;
const DEFAULT_CHANNELS = 1; // Mono

/**
 * Request microphone access and create MediaStream
 */
export async function requestMicrophoneAccess(
  options: AudioCaptureOptions = {}
): Promise<MediaStream> {
  const constraints: MediaStreamConstraints = {
    audio: {
      sampleRate: options.sampleRate || DEFAULT_SAMPLE_RATE,
      channelCount: options.channels || DEFAULT_CHANNELS,
      echoCancellation: options.echoCancellation ?? true,
      noiseSuppression: options.noiseSuppression ?? true,
      autoGainControl: options.autoGainControl ?? true,
    },
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        throw new Error('Microphone permission denied. Please allow microphone access.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        throw new Error('No microphone found. Please connect a microphone.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        throw new Error('Microphone is already in use by another application.');
      }
    }
    throw error;
  }
}

/**
 * Create AudioContext for processing audio
 */
export function createAudioContext(sampleRate: number = DEFAULT_SAMPLE_RATE): AudioContext {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  
  // CRITICAL: Use browser's default sample rate if it doesn't support the requested rate
  // Many browsers don't support arbitrary sample rates and will resample, causing noise
  // Check if the browser supports the requested sample rate
  const context = new AudioContextClass({
    sampleRate,
    latencyHint: 'interactive',
  });
  
  // Log the actual sample rate (browser might have changed it)
  if (context.sampleRate !== sampleRate) {
  } else {
  }
  
  return context;
}

/**
 * Convert MediaStream to PCM audio data
 * Returns a function to start capturing and a function to stop
 */
export function createAudioCapture(
  stream: MediaStream,
  audioContext: AudioContext,
  onAudioData: (pcmData: Int16Array) => void,
  chunkIntervalMs: number = 100
): { start: () => void; stop: () => void } {
  const source = audioContext.createMediaStreamSource(stream);
  
  // Note: ScriptProcessorNode is deprecated but still widely supported
  // Migrating to AudioWorkletNode would require:
  // 1. Creating an AudioWorklet processor file
  // 2. Loading it as a module
  // 3. More complex setup
  // For now, we use ScriptProcessorNode as it works reliably across browsers
  // The deprecation warning can be safely ignored - it still functions correctly
  // @ts-ignore - ScriptProcessorNode is deprecated but still works
  const processor = audioContext.createScriptProcessor(4096, 1, 1);

  let isCapturing = false;
  let intervalId: number | null = null;

  processor.onaudioprocess = (event) => {
    if (!isCapturing) return;

    const inputBuffer = event.inputBuffer;
    const inputData = inputBuffer.getChannelData(0);
    
    // Convert Float32Array to Int16Array (PCM)
    const pcmData = new Int16Array(inputData.length);
    for (let i = 0; i < inputData.length; i++) {
      // Clamp and convert to 16-bit PCM
      const s = Math.max(-1, Math.min(1, inputData[i]));
      pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    onAudioData(pcmData);
  };

  source.connect(processor);
  processor.connect(audioContext.destination);

  const start = () => {
    isCapturing = true;
  };

  const stop = () => {
    isCapturing = false;
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    processor.disconnect();
    source.disconnect();
  };

  return { start, stop };
}

/**
 * Convert PCM Int16Array to base64 string
 */
export function pcmToBase64(pcmData: Int16Array): string {
  const buffer = pcmData.buffer;
  const bytes = new Uint8Array(buffer);
  
  // Convert to base64
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Fallback: Play audio with WAV header using HTML5 Audio (like HTML implementation)
 * Only used when Web Audio API fails
 */
function playAudioWithWAVHeader(
  pcmData: ArrayBuffer,
  sampleRate: number,
  resolve: () => void,
  reject: (error: Error) => void
): void {
  try {
    const int16Data = new Int16Array(pcmData);
    const wavHeader = createWavHeader(int16Data.length, sampleRate);
    const pcmBytes = new Uint8Array(pcmData);
    
    // Combine header + PCM data
    const wavData = new Uint8Array(wavHeader.length + pcmBytes.length);
    wavData.set(wavHeader, 0);
    wavData.set(pcmBytes, wavHeader.length);
    
    // Add WAV header to raw PCM - CRITICAL: Must specify 24kHz sample rate
    const wavBlob = new Blob([wavData], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(wavBlob);
    const audio = new Audio(audioUrl);
    
    // CRITICAL: Set playbackRate to 1.0 to prevent speed issues
    audio.playbackRate = 1.0;
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      resolve();
    };
    
    audio.onerror = (error) => {
      URL.revokeObjectURL(audioUrl);
      reject(new Error('Audio playback failed'));
    };
    
    audio.play().catch((err) => {
      URL.revokeObjectURL(audioUrl);
      reject(err);
    });
  } catch (err) {
    reject(new Error('Failed to create audio with WAV header'));
  }
}

/**
 * Generate WAV header for PCM audio data (for HTML5 Audio fallback only)
 * Browsers require a WAV header for linear16 PCM audio playback
 * Reference: https://developers.deepgram.com/docs/voice-agent-audio-playback#attempting-to-play-audio-in-a-web-browser
 */
function createWavHeader(dataLength: number, sampleRate: number): Uint8Array {
  const numChannels = 1; // Mono
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = dataLength * (bitsPerSample / 8);
  const fileSize = 36 + dataSize;

  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF chunk descriptor
  view.setUint8(0, 0x52); // "R"
  view.setUint8(1, 0x49); // "I"
  view.setUint8(2, 0x46); // "F"
  view.setUint8(3, 0x46); // "F"
  view.setUint32(4, fileSize, true); // File size
  view.setUint8(8, 0x57); // "W"
  view.setUint8(9, 0x41); // "A"
  view.setUint8(10, 0x56); // "V"
  view.setUint8(11, 0x45); // "E"

  // fmt sub-chunk
  view.setUint8(12, 0x66); // "f"
  view.setUint8(13, 0x6d); // "m"
  view.setUint8(14, 0x74); // "t"
  view.setUint8(15, 0x20); // " "
  view.setUint32(16, 16, true); // Sub-chunk size (16 for PCM)
  view.setUint16(20, 1, true); // Audio format (1 = PCM)
  view.setUint16(22, numChannels, true); // Number of channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, byteRate, true); // Byte rate
  view.setUint16(32, blockAlign, true); // Block align
  view.setUint16(34, bitsPerSample, true); // Bits per sample

  // data sub-chunk
  view.setUint8(36, 0x64); // "d"
  view.setUint8(37, 0x61); // "a"
  view.setUint8(38, 0x74); // "t"
  view.setUint8(39, 0x61); // "a"
  view.setUint32(40, dataSize, true); // Data size

  return new Uint8Array(header);
}

/**
 * Play PCM audio data from binary WebSocket message
 * 
 * IMPORTANT: AudioContext must be resumed before calling this function
 * due to browser autoplay policies. Call audioContext.resume() first.
 * 
 * This function prepends a WAV header to the PCM data as required by browsers
 * for playing linear16 audio. Reference:
 * https://developers.deepgram.com/docs/voice-agent-audio-playback#attempting-to-play-audio-in-a-web-browser
 * 
 * Uses AudioContext.decodeAudioData() to decode the WAV-formatted audio,
 * which is more reliable for streaming audio chunks.
 */
export async function playPCMAudio(
  audioContext: AudioContext,
  pcmData: ArrayBuffer,
  sampleRate: number = DEFAULT_SAMPLE_RATE,
  scheduledTime?: number // Optional: schedule at specific time to prevent gaps
): Promise<void> {
  // Log audio info
  
  // Validate input
  if (!pcmData || pcmData.byteLength === 0) {
    return;
  }

  // CRITICAL: Skip very small chunks (like HTML implementation)
  if (pcmData.byteLength < 100) {
    return;
  }

  // CRITICAL: Interpret incoming data as raw 16-bit signed PCM (little-endian)
  // The ArrayBuffer contains raw PCM bytes that need to be interpreted as Int16Array
  // Int16Array automatically handles little-endian byte order
  const int16Data = new Int16Array(pcmData);

  // Validate data length
  if (int16Data.length === 0) {
    return;
  }

      // MATCH HTML IMPLEMENTATION: Convert 16-bit PCM directly to Float32Array and create AudioBuffer
      // No WAV header needed for Web Audio API - create AudioBuffer directly from PCM data
      // This is simpler and more efficient than using decodeAudioData with WAV header
      
      // Resume context if suspended (browser autoplay policy)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Convert 16-bit PCM to Float32Array for Web Audio API (like HTML implementation)
      // Deepgram sends 16-bit PCM (little-endian), mono, 24kHz
      const float32Data = new Float32Array(int16Data.length);
      
      // Convert 16-bit PCM to Float32 (-1.0 to 1.0 range)
      for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0;
      }

      // Create AudioBuffer with correct sample rate (like HTML implementation)
      // CRITICAL: Use 24000 Hz sample rate to match Deepgram output
      const audioBuffer = audioContext.createBuffer(
        1, // channels (mono)
        float32Data.length, // length in samples
        sampleRate // sample rate (24000 Hz - CRITICAL: must match Deepgram output)
      );

      // Copy data to buffer
      audioBuffer.getChannelData(0).set(float32Data);

      // Create and play source (like HTML implementation)
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // CRITICAL: Simplify audio chain to reduce artifacts
      // Only use gain node - remove filter to avoid phase distortion
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 1.0;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Schedule playback
      const playTime = scheduledTime !== undefined 
        ? Math.max(audioContext.currentTime, scheduledTime) 
        : audioContext.currentTime;
      
      const safePlayTime = Math.max(audioContext.currentTime, playTime);
      
      return new Promise((resolve, reject) => {
        source.onended = () => {
          // Log occasionally to confirm playback is happening
          if (Math.random() < 0.05) {
          }
          resolve();
        };

        source.onerror = (error) => {
          reject(new Error('Audio playback failed'));
        };

        source.start(safePlayTime);
      });
}

/**
 * Stop all audio playback
 */
export function stopAudioPlayback(audioContext: AudioContext): void {
  // Note: AudioContext doesn't have a direct way to stop all sources
  // This is handled by individual source.stop() calls
  // We can suspend the context if needed
  if (audioContext.state !== 'closed') {
    audioContext.suspend().catch(() => {});
  }
}
