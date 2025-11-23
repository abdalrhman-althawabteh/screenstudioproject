export interface CursorPosition {
  x: number;
  y: number;
  timestamp: number;
}

export interface ZoomPoint {
  x: number;
  y: number;
  scale: number;
  timestamp: number;
}

export interface RecordingSettings {
  fps: number;
  quality: string;
  cursorEffects: boolean;
  autoZoom: boolean;
  backgroundPadding: number;
  backgroundColor: string;
  cursorGlow: boolean;
  smoothCursor: boolean;
}
