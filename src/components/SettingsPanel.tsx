import React from 'react';
import { RecordingSettings } from '../types';

interface SettingsPanelProps {
  settings: RecordingSettings;
  onSettingsChange: (settings: RecordingSettings) => void;
  disabled?: boolean;
}

export function SettingsPanel({ settings, onSettingsChange, disabled = false }: SettingsPanelProps) {
  const updateSetting = <K extends keyof RecordingSettings>(
    key: K,
    value: RecordingSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#2a2a2a',
      borderRadius: '12px',
    }}>
      <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>
        Recording Settings
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* FPS */}
        <div>
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            Frame Rate (FPS)
          </label>
          <select
            value={settings.fps}
            onChange={(e) => updateSetting('fps', parseInt(e.target.value))}
            disabled={disabled}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              border: '1px solid #3a3a3a',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            <option value={30}>30 FPS</option>
            <option value={60}>60 FPS</option>
          </select>
        </div>

        {/* Quality */}
        <div>
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            Video Quality
          </label>
          <select
            value={settings.quality}
            onChange={(e) => updateSetting('quality', e.target.value)}
            disabled={disabled}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              border: '1px solid #3a3a3a',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            <option value="standard">Standard (5 Mbps)</option>
            <option value="high">High (8 Mbps)</option>
          </select>
        </div>

        {/* Background Padding */}
        <div>
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            Background Padding: {settings.backgroundPadding}px
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.backgroundPadding}
            onChange={(e) => updateSetting('backgroundPadding', parseInt(e.target.value))}
            disabled={disabled}
            style={{ width: '100%' }}
          />
        </div>

        {/* Background Color */}
        <div>
          <label style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            Background Color
          </label>
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) => updateSetting('backgroundColor', e.target.value)}
            disabled={disabled}
            style={{
              width: '100%',
              height: '40px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #3a3a3a',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          />
        </div>

        {/* Cursor Effects */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={settings.cursorEffects}
              onChange={(e) => updateSetting('cursorEffects', e.target.checked)}
              disabled={disabled}
              style={{ cursor: 'pointer' }}
            />
            Enable Cursor Effects
          </label>
        </div>

        {/* Cursor Glow */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={settings.cursorGlow}
              onChange={(e) => updateSetting('cursorGlow', e.target.checked)}
              disabled={!settings.cursorEffects || disabled}
              style={{ cursor: 'pointer' }}
            />
            Cursor Glow
          </label>
        </div>

        {/* Smooth Cursor */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={settings.smoothCursor}
              onChange={(e) => updateSetting('smoothCursor', e.target.checked)}
              disabled={!settings.cursorEffects || disabled}
              style={{ cursor: 'pointer' }}
            />
            Smooth Cursor Trail
          </label>
        </div>

        {/* Auto Zoom */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={settings.autoZoom}
              onChange={(e) => updateSetting('autoZoom', e.target.checked)}
              disabled={disabled}
              style={{ cursor: 'pointer' }}
            />
            AI-Powered Auto Zoom
          </label>
          <p style={{
            margin: '4px 0 0 24px',
            fontSize: '12px',
            color: '#888',
          }}>
            Automatically zooms in on detailed work and zooms out during navigation
          </p>
        </div>
      </div>
    </div>
  );
}
