export interface TabConfig {
  id: string;
  label: string;
  icon: React.ElementType;
}

export interface ChatMessage {
  id: number;
  sender: 'A' | 'B';
  text: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
}

export enum ConnectionState {
  DISCONNECTED,
  CONNECTING,
  CONNECTED
}

export type LaneType = 'short' | 'long' | 'ws';