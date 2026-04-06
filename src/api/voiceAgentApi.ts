// Voice Agent WebSocket API
// Base URL for the voice agent API - can be configured via environment variable
const VOICE_AGENT_BASE_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8080';

export type VoiceAgentMessageType =
  | 'settings'
  | 'audio'
  | 'close'
  | 'settings_applied'
  | 'conversation_text'
  | 'agent_started_speaking'
  | 'agent_audio_done'
  | 'error'
  | 'connection_closed';

export interface VoiceAgentSettings {
  audio_input_encoding?: 'linear16';
  audio_input_sample_rate?: number;
  think_prompt?: string;
}

export interface VoiceAgentSettingsMessage {
  type: 'settings';
  settings: VoiceAgentSettings;
}

export interface VoiceAgentAudioMessage {
  type: 'audio';
  audio: string; // base64 encoded PCM audio
}

export interface VoiceAgentCloseMessage {
  type: 'close';
}

export type VoiceAgentOutgoingMessage =
  | VoiceAgentSettingsMessage
  | VoiceAgentAudioMessage
  | VoiceAgentCloseMessage;

export interface VoiceAgentSettingsAppliedMessage {
  type: 'settings_applied';
}

export interface VoiceAgentConversationTextMessage {
  type: 'conversation_text';
  text: string;
}

export interface VoiceAgentStartedSpeakingMessage {
  type: 'agent_started_speaking';
}

export interface VoiceAgentAudioDoneMessage {
  type: 'agent_audio_done';
}

export interface VoiceAgentErrorMessage {
  type: 'error';
  text: string;
}

export interface VoiceAgentConnectionClosedMessage {
  type: 'connection_closed';
}

export type VoiceAgentIncomingMessage =
  | VoiceAgentSettingsAppliedMessage
  | VoiceAgentConversationTextMessage
  | VoiceAgentStartedSpeakingMessage
  | VoiceAgentAudioDoneMessage
  | VoiceAgentErrorMessage
  | VoiceAgentConnectionClosedMessage;

/**
 * Get the WebSocket URL for the voice agent API.
 * Converts HTTP/HTTPS URLs to WS/WSS protocol as required for WebSocket connections.
 */
export function getVoiceAgentWebSocketUrl(): string {
  const baseUrl = VOICE_AGENT_BASE_URL.trim();
  
  // Convert HTTP/HTTPS to WS/WSS for WebSocket connections
  let wsUrl = baseUrl;
  if (baseUrl.startsWith('http://')) {
    wsUrl = baseUrl.replace('http://', 'ws://');
  } else if (baseUrl.startsWith('https://')) {
    wsUrl = baseUrl.replace('https://', 'wss://');
  } else if (!baseUrl.startsWith('ws://') && !baseUrl.startsWith('wss://')) {
    // If no protocol specified, default to ws:// for localhost, wss:// for others
    if (baseUrl.includes('localhost') || baseUrl.startsWith('127.0.0.1')) {
      wsUrl = `ws://${baseUrl}`;
    } else {
      wsUrl = `wss://${baseUrl}`;
    }
  }
  
  return `${wsUrl}/v1/voice-agent/ws`;
}
