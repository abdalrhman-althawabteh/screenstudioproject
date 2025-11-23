# Screen Studio Recorder

A professional screen recording application with AI-powered features similar to Screen Studio.

## Features

### 🎯 Core Features
- **Screen Recording**: Capture your screen or specific windows in high quality
- **Audio Recording**: Record system audio alongside your screen
- **60 FPS Support**: Smooth, high frame rate recordings

### ✨ Advanced Features
- **Cursor Tracking**: Intelligent cursor position tracking throughout the recording
- **Smooth Cursor Effects**: Professional-looking animated cursor with glow effects
- **Cursor Trail**: Visual trail following cursor movements
- **AI-Powered Auto Zoom**: Automatically zooms in on detailed work and zooms out during navigation
  - Detects cursor movement speed and patterns
  - Zooms in when you're doing detailed work (slow movements)
  - Zooms out when navigating (fast movements)
- **Automatic Camera Movements**: Smooth zoom and pan effects that follow your cursor
- **Background & Padding**: Customizable backgrounds with adjustable padding around content
- **High-Quality Export**: Exports in WebM format with VP9 codec for optimal quality

### 🎨 Customization
- Adjustable FPS (30 or 60)
- Video quality settings (Standard 5Mbps or High 8Mbps)
- Custom background colors
- Adjustable padding (0-100px)
- Toggle cursor effects on/off
- Toggle AI zoom on/off

## Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Package the app
npm run package
```

## Usage

1. **Select Source**: Choose the screen or window you want to record
2. **Configure Settings**: Adjust recording settings in the right panel
   - Enable/disable cursor effects
   - Enable/disable AI-powered zoom
   - Adjust background padding and color
   - Choose video quality
3. **Start Recording**: Click "Start Recording" button
4. **Control Recording**: Use Pause/Resume and Stop buttons
5. **Export**: Recording automatically saves as WebM file when stopped

## How It Works

### Cursor Tracking
The app tracks cursor position at 60fps and stores recent positions to create smooth cursor effects and trails.

### AI-Powered Zoom
The zoom algorithm analyzes cursor movement patterns:
- **Slow movements** (< 5px average): Zoom in to 1.3x - indicates detailed work
- **Fast movements** (> 20px average): Zoom out to 1.0x - indicates navigation
- **Medium movements**: Slight zoom to 1.15x - balanced view

The zoom transitions are smoothed using linear interpolation for professional-looking camera movements.

### Canvas Rendering
- Uses HTML5 Canvas to composite the screen recording with effects
- Applies real-time transformations for zoom and pan
- Renders cursor effects including glow and trail
- Adds background padding and custom colors

## Technical Stack

- **Electron**: Desktop application framework
- **React**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **Canvas API**: Real-time video effects
- **MediaRecorder API**: Screen capture and recording

## System Requirements

- macOS 10.13+, Windows 10+, or Linux
- 4GB RAM minimum (8GB recommended)
- Modern CPU for smooth 60fps encoding

## License

MIT
