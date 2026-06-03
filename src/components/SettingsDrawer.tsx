/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TeleprompterSettings, FontFamily, FontWeight, LetterSpacing, TextColorPreset, BackgroundStyle } from '../types';
import { 
  Type, Sliders, Brush, Layers, FlipHorizontal, FlipVertical, Eye, 
  HelpCircle, ChevronRight, Check, SlidersHorizontal, SunMoon 
} from 'lucide-react';

interface SettingsDrawerProps {
  theme: 'dark' | 'light';
  settings: TeleprompterSettings;
  onUpdateSettings: (updates: Partial<TeleprompterSettings>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FONTS: { id: FontFamily; label: string }[] = [
  { id: 'Inter', label: 'Inter (Classic)' },
  { id: 'Poppins', label: 'Poppins (Bold)' },
  { id: 'Manrope', label: 'Manrope (Modern)' },
  { id: 'Outfit', label: 'Outfit (Creator)' },
  { id: 'JetBrains Mono', label: 'JetBrains (Tech)' },
  { id: 'System', label: 'System Sans' }
];

const WEIGHTS: { id: FontWeight; label: string }[] = [
  { id: '300', label: 'Light' },
  { id: '400', label: 'Regular' },
  { id: '500', label: 'Medium' },
  { id: '600', label: 'Semibold' },
  { id: '700', label: 'Bold' },
  { id: '800', label: 'Extra Bold' }
];

const TEXT_COLORS: { id: TextColorPreset; label: string; colorClass: string; hex: string }[] = [
  { id: 'white', label: 'Studio White', colorClass: 'bg-white', hex: '#FFFFFF' },
  { id: 'yellow', label: 'Prompt Yellow', colorClass: 'bg-yellow-400', hex: '#FACC15' },
  { id: 'green', label: 'Podcast Green', colorClass: 'bg-emerald-400', hex: '#34D399' },
  { id: 'cyan', label: 'Cyber Cyan', colorClass: 'bg-cyan-400', hex: '#22D3EE' },
  { id: 'purple', label: 'Vibrant Violet', colorClass: 'bg-purple-400', hex: '#C084FC' },
  { id: 'pink', label: 'Neon Pink', colorClass: 'bg-pink-400', hex: '#F472B6' },
  { id: 'red', label: 'Alert Red', colorClass: 'bg-red-400', hex: '#F87171' }
];

const BACKDROP_STYLES: { id: BackgroundStyle; label: string; preview: string }[] = [
  { id: 'black', label: 'Absolute Black', preview: 'bg-black' },
  { id: 'dark-gray', label: 'Studio Gray', preview: 'bg-neutral-800' },
  { id: 'light-gray', label: 'Modern Light', preview: 'bg-neutral-200' },
  { id: 'glassmorphism', label: 'Frosted Glass', preview: 'bg-white/10 backdrop-blur-md border border-white/20' },
  { id: 'transparent', label: 'Transparent Mask', preview: 'bg-transparent border border-dashed border-neutral-700' },
  { id: 'gradient-cosmic', label: 'Cosmic Twilight', preview: 'bg-gradient-to-tr from-[#11012C] to-[#010D20]' },
  { id: 'gradient-cyber', label: 'Cyber Tech', preview: 'bg-gradient-to-tr from-[#09151A] to-[#12051C]' },
  { id: 'gradient-sunset', label: 'Warm Sunset', preview: 'bg-gradient-to-tr from-[#1E0B19] to-[#040D15]' }
];

const TRACKINGS: { id: LetterSpacing; label: string }[] = [
  { id: 'tracking-tighter', label: 'Tighter' },
  { id: 'tracking-tight', label: 'Tight' },
  { id: 'tracking-normal', label: 'Normal' },
  { id: 'tracking-wide', label: 'Wide' },
  { id: 'tracking-widest', label: 'Widest' }
];

export default function SettingsDrawer({
  theme,
  settings,
  onUpdateSettings,
  isOpen,
  onClose
}: SettingsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed right-0 top-[65px] sm:top-[73px] bottom-0 w-full max-w-[320px] sm:max-w-md md:w-96 border-l z-40 flex flex-col transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-[#0A0A0A]/95 text-white border-white/10 shadow-2xl backdrop-blur-xl' 
          : 'bg-white/95 text-neutral-800 border-zinc-200 shadow-xl backdrop-blur-xl'
      }`}
      id="teleprompter-settings-drawer"
    >
      {/* Drawer Header */}
      <div className={`flex items-center justify-between p-5 border-b ${theme === 'dark' ? 'border-white/10' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-blue-500" />
          <h3 className="font-sans font-bold text-base tracking-tight">Workspace Controls</h3>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${
            theme === 'dark' ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-neutral-450 hover:text-neutral-850 hover:bg-zinc-150'
          }`}
          id="btn-close-settings-drawer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6" id="settings-scroll-container">
        {/* SECTION 1: TYPOGRAPHY */}
        <div className="space-y-4">
          <div className={`flex items-center gap-2 border-b pb-1 ${theme === 'dark' ? 'border-white/10' : 'border-zinc-200'}`}>
            <Type className="w-4 h-4 text-purple-400" />
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Typography Controls</h4>
          </div>

          {/* Font Family Choice Grid */}
          <div className="space-y-1.5">
            <label className={`text-[10px] font-mono uppercase font-semibold ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Font Family</label>
            <div className="grid grid-cols-2 gap-1 px-0.5">
              {FONTS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => onUpdateSettings({ fontFamily: font.id })}
                  className={`py-1.5 px-2 rounded-xl text-left truncate text-xs font-sans border cursor-pointer transition-all ${
                    settings.fontFamily === font.id
                      ? (theme === 'dark' ? 'border-blue-500 bg-blue-600/10 text-white' : 'border-blue-500 bg-blue-50 text-blue-600 font-semibold')
                      : (theme === 'dark' ? 'border-white/10 text-white/60 hover:bg-white/5' : 'border-zinc-200 text-neutral-500 hover:bg-zinc-50')
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size slider */}
          <div className="space-y-1.5">
            <div className={`flex justify-between items-center text-[10px] font-mono uppercase ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>
              <span>Font Size</span>
              <span className="text-blue-555 font-bold">{settings.fontSize}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="110"
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ fontSize: parseInt(e.target.value) })}
              className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-blue-500 ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-200'}`}
            />
          </div>

          {/* Font Weight choice */}
          <div className="space-y-1.5">
            <label className={`text-[10px] font-mono uppercase font-semibold ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Font Weight</label>
            <div className="flex flex-wrap gap-1">
              {WEIGHTS.map((weight) => (
                <button
                  key={weight.id}
                  onClick={() => onUpdateSettings({ fontWeight: weight.id })}
                  className={`py-1 px-2.5 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
                    settings.fontWeight === weight.id
                      ? (theme === 'dark' ? 'border-blue-500 bg-blue-600/10 text-white' : 'border-blue-500 bg-blue-50 text-blue-600 font-semibold')
                      : (theme === 'dark' ? 'border-white/10 text-white/60 hover:bg-white/5' : 'border-zinc-200 text-neutral-500 hover:bg-zinc-50')
                  }`}
                >
                  {weight.label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height slider */}
          <div className="space-y-1.5">
            <div className={`flex justify-between items-center text-[10px] font-mono uppercase ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>
              <span>Line Height</span>
              <span className="text-blue-555 font-bold">{settings.lineHeight}x</span>
            </div>
            <input
              type="range"
              min="1.2"
              max="2.2"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => onUpdateSettings({ lineHeight: parseFloat(e.target.value) })}
              className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-blue-500 ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-200'}`}
            />
          </div>

          {/* Letter Spacing selection */}
          <div className="space-y-1.5">
            <label className={`text-[10px] font-mono uppercase font-semibold ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Letter Spacing</label>
            <div className="grid grid-cols-5 gap-1">
              {TRACKINGS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => onUpdateSettings({ letterSpacing: track.id })}
                  className={`py-1 rounded-lg text-[9px] text-center font-mono border cursor-pointer transition-all ${
                    settings.letterSpacing === track.id
                      ? (theme === 'dark' ? 'border-blue-500 bg-blue-600/15 text-white' : 'border-blue-500 bg-blue-50 text-blue-600 font-semibold')
                      : (theme === 'dark' ? 'border-white/10 text-white/60 hover:bg-white/5' : 'border-zinc-200 text-neutral-500 hover:bg-zinc-50')
                  }`}
                  title={track.label}
                >
                  {track.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: GRAPHICS & THEME */}
        <div className="space-y-4">
          <div className={`flex items-center gap-2 border-b pb-1 ${theme === 'dark' ? 'border-white/10' : 'border-zinc-200'}`}>
            <Brush className="w-4 h-4 text-blue-400" />
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Design Colors</h4>
          </div>

          {/* Text Color Presets */}
          <div className="space-y-1.5">
            <label className={`text-[10px] font-mono uppercase font-semibold ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Text Color Customizer</label>
            <div className="flex flex-wrap gap-2">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => onUpdateSettings({ textColorPreset: color.id })}
                  className={`w-7 h-7 rounded-full relative cursor-pointer group flex items-center justify-center transition-all duration-200 border-2 ${color.colorClass} ${
                    settings.textColorPreset === color.id
                      ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/25'
                      : (theme === 'dark' ? 'border-white/10 hover:border-white/30' : 'border-zinc-200 hover:border-zinc-400')
                  }`}
                  title={color.label}
                >
                  {settings.textColorPreset === color.id && (
                    <Check className={`w-4 h-4 ${color.id === 'white' ? 'text-black' : 'text-neutral-950'}`} />
                  )}
                </button>
              ))}
              
              {/* Custom hex selector option */}
              <button
                onClick={() => onUpdateSettings({ textColorPreset: 'custom' })}
                className={`w-7 h-7 rounded-full cursor-pointer flex items-center justify-center text-xs font-mono border-2 ${
                  settings.textColorPreset === 'custom'
                    ? 'border-blue-500 scale-110 bg-blue-950/40 text-blue-400'
                    : (theme === 'dark' ? 'border-white/10 bg-white/5 text-white/40' : 'border-zinc-200 bg-neutral-100 text-neutral-400')
                }`}
                title="Custom Color"
              >
                Hex
              </button>
            </div>

            {/* Custom HEX code picker input if custom is chosen */}
            {settings.textColorPreset === 'custom' && (
              <div className="flex items-center gap-2 mt-1.5">
                <input
                  type="color"
                  value={settings.customTextColor}
                  onChange={(e) => onUpdateSettings({ customTextColor: e.target.value })}
                  className="w-8 h-8 rounded-full border-none cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  maxLength={7}
                  value={settings.customTextColor}
                  onChange={(e) => onUpdateSettings({ customTextColor: e.target.value })}
                  className={`border rounded-xl px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-blue-500 flex-1 h-8 ${
                    theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-white border-zinc-200 text-neutral-800'
                  }`}
                  placeholder="#00D2FF"
                />
              </div>
            )}
          </div>

          {/* Background layout choices */}
          <div className="space-y-1.5">
            <label className={`text-[10px] font-mono uppercase font-semibold ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Background Style</label>
            <div className="grid grid-cols-2 gap-1.5">
              {BACKDROP_STYLES.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => onUpdateSettings({ backgroundStyle: bg.id })}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-left cursor-pointer transition-all ${
                    settings.backgroundStyle === bg.id
                      ? 'border-blue-500 bg-blue-600/10'
                      : (theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-zinc-200 bg-neutral-50 hover:bg-neutral-100')
                  }`}
                >
                  <div className={`w-4 h-4 rounded ${bg.preview}`} />
                  <span className={`text-[10px] font-semibold truncate ${theme === 'dark' ? 'text-white/80' : 'text-neutral-700'}`}>{bg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Overlay / Opacity controls */}
          <div className="space-y-1.5">
            <div className={`flex justify-between items-center text-[10px] font-mono uppercase ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>
              <span>Backing Opacity</span>
              <span className="text-blue-555 font-bold">{settings.bgOpacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.bgOpacity}
              onChange={(e) => onUpdateSettings({ bgOpacity: parseInt(e.target.value) })}
              className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-blue-500 ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-200'}`}
            />
          </div>
        </div>

        {/* SECTION 3: FOCUS & PHYSICAL MIRRORING GLAS */}
        <div className="space-y-4">
          <div className={`flex items-center gap-2 border-b pb-1 ${theme === 'dark' ? 'border-white/10' : 'border-zinc-200'}`}>
            <Layers className="w-4 h-4 text-emerald-400" />
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Eye-Level & Mirroring</h4>
          </div>

          {/* Focus Reading Mode */}
          <div className={`flex items-center justify-between p-3 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-zinc-250'}`}>
            <div className="flex flex-col">
              <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-white/80' : 'text-neutral-700'}`}>Focus Reading Mode</span>
              <span className={`text-[9px] ${theme === 'dark' ? 'text-white/40' : 'text-neutral-400'}`}>Fades top/bottom non-current text</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ focusMode: !settings.focusMode })}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                settings.focusMode ? 'bg-blue-500' : (theme === 'dark' ? 'bg-white/10' : 'bg-zinc-250')
              }`}
            >
              <div className={`bg-white shadow w-4 h-4 rounded-full transition-transform duration-200 ${
                settings.focusMode ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Reading Guide */}
          <div className={`flex items-center justify-between p-3 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-zinc-250'}`}>
            <div className="flex flex-col">
              <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-white/80' : 'text-neutral-700'}`}>Reading Guide Zone</span>
              <span className={`text-[9px] ${theme === 'dark' ? 'text-white/40' : 'text-neutral-400'}`}>Shows a central alignment guideline</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ readingGuide: !settings.readingGuide })}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                settings.readingGuide ? 'bg-blue-500' : (theme === 'dark' ? 'bg-white/10' : 'bg-zinc-250')
              }`}
            >
              <div className={`bg-white shadow w-4 h-4 rounded-full transition-transform duration-200 ${
                settings.readingGuide ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Horizontal Mirror Flip */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateSettings({ mirrorHorizontal: !settings.mirrorHorizontal })}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                settings.mirrorHorizontal
                  ? 'border-blue-500 bg-blue-600/10 text-white'
                  : (theme === 'dark' ? 'border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10' : 'border-zinc-200 bg-neutral-50 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100')
              }`}
            >
              <FlipHorizontal className="w-4 h-4 text-blue-400 mb-1" />
              <span className="text-xs font-semibold">Flip Horizontal</span>
              <span className={`text-[8px] uppercase font-mono mt-0.5 ${theme === 'dark' ? 'text-white/40' : 'text-neutral-450'}`}>Camera Glass</span>
            </button>

            {/* Vertical Mirror Flip */}
            <button
              onClick={() => onUpdateSettings({ mirrorVertical: !settings.mirrorVertical })}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                settings.mirrorVertical
                  ? 'border-purple-400 bg-purple-950/10 text-white'
                  : (theme === 'dark' ? 'border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10' : 'border-zinc-200 bg-neutral-50 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100')
              }`}
            >
              <FlipVertical className="w-4.5 h-4.5 text-purple-400 mb-1" />
              <span className="text-xs font-semibold">Flip Vertical</span>
              <span className={`text-[8px] uppercase font-mono mt-0.5 ${theme === 'dark' ? 'text-white/40' : 'text-neutral-450'}`}>Overhead Glass</span>
            </button>
          </div>
        </div>

        {/* Quick Instructions info box */}
        <div className={`rounded-2xl border p-4.5 flex flex-col gap-1 ${
          theme === 'dark' ? 'bg-blue-500/5 border-blue-500/15' : 'bg-blue-50/50 border-blue-100/70'
        }`}>
          <span className="text-[10px] font-mono text-blue-500 font-bold uppercase tracking-wider">Splitter Glass Setup</span>
          <p className={`text-[10px] leading-normal font-sans ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>
            If placing your screen under a 45-degree splitter teleprompter glass, activate **Flip Horizontal** to reverse reflection mirroring.
          </p>
        </div>
      </div>
    </div>
  );
}
