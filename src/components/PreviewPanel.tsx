/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { TeleprompterSettings, Script } from '../types';
import { Play, Pause, Maximize2, RotateCcw, Sliders, Eye, FileText } from 'lucide-react';

interface PreviewPanelProps {
  theme: 'dark' | 'light';
  settings: TeleprompterSettings;
  activeScript: Script;
  isScrolling: boolean;
  onToggleScroll: () => void;
  onResetScroll: () => void;
  onOpenWorkspacePrompter: () => void;
}

export default function PreviewPanel({
  theme,
  settings,
  activeScript,
  isScrolling,
  onToggleScroll,
  onResetScroll,
  onOpenWorkspacePrompter
}: PreviewPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll effect inside preview (scaled representation)
  useEffect(() => {
    if (!isScrolling || !scrollRef.current) return;

    let animationId: number;
    let lastTime = performance.now();

    const speedMultiplier = settings.scrollSpeed * 0.15; // Scaled down for preview panel comfort

    const scroll = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (scrollRef.current) {
        scrollRef.current.scrollTop += speedMultiplier * delta;

        // Reset if it scrolls out of bounds
        if (
          scrollRef.current.scrollTop >= 
          (scrollRef.current.scrollHeight - scrollRef.current.clientHeight)
        ) {
          scrollRef.current.scrollTop = 0;
        }
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isScrolling, settings.scrollSpeed, activeScript.content]);

  // Determine Custom styles
  const getTextColorClass = () => {
    switch (settings.textColorPreset) {
      case 'white': return 'text-white';
      case 'yellow': return 'text-yellow-400 text-glow-yellow';
      case 'green': return 'text-emerald-400 text-glow-green';
      case 'cyan': return 'text-cyan-400 text-glow-cyan';
      case 'purple': return 'text-purple-400 text-glow-purple';
      case 'pink': return 'text-pink-400 text-glow-pink';
      case 'red': return 'text-red-400 text-glow-red';
      case 'custom': return '';
    }
  };

  const getBackgroundClass = () => {
    switch (settings.backgroundStyle) {
      case 'black': return 'bg-black text-white';
      case 'dark-gray': return 'bg-[#151515] text-white';
      case 'light-gray': return 'bg-[#F3F4F6] text-neutral-900 border-neutral-200';
      case 'transparent': return 'bg-transparent border border-white/10 border-dashed';
      case 'glassmorphism': return 'glass-panel text-white';
      case 'gradient-cosmic': return 'bg-gradient-to-b from-[#11012C] via-[#040108] to-[#010D20] text-white';
      case 'gradient-cyber': return 'bg-gradient-to-b from-[#09151A] via-[#05060B] to-[#12051C] text-white';
      case 'gradient-sunset': return 'bg-gradient-to-b from-[#1E0B19] via-[#0C0513] to-[#040D15] text-white';
    }
  };

  const getFontFamilyStyle = () => {
    switch (settings.fontFamily) {
      case 'Inter': return 'font-sans';
      case 'Poppins': return 'font-poppins';
      case 'Manrope': return 'font-manrope';
      case 'Outfit': return 'font-outfit';
      case 'JetBrains Mono': return 'font-mono';
      case 'System': return 'font-sans';
      default: return 'font-sans';
    }
  };

  const cssTextOpacity = settings.focusMode ? 'opacity-30' : 'opacity-100';

  return (
    <div 
      className={`rounded-3xl border p-6 flex flex-col h-full gap-5 transition-all duration-300 relative overflow-hidden ${
        theme === 'dark' 
          ? 'bg-white/[0.02] border-white/10 text-white shadow-xl shadow-black/30' 
          : 'bg-[#F8F9FB] border-zinc-200 text-neutral-800 shadow-sm'
      }`}
      id="right-preview-panel-container"
    >
      {/* Panel Header */}
      <div className={`flex items-center justify-between border-b pb-4 ${theme === 'dark' ? 'border-white/10' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-400" />
          <h2 className="font-sans font-bold text-base tracking-tight">Studio Monitor</h2>
        </div>
        
        {/* Launch Floating overlay button */}
        <button
          onClick={onOpenWorkspacePrompter}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs ${
            theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-neutral-900 text-white hover:bg-neutral-800'
          }`}
          id="btn-trigger-floating"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Launch Teleprompter</span>
        </button>
      </div>

      {/* Styled Simulation Box */}
      <div 
        ref={containerRef}
        className={`flex-1 rounded-2xl relative overflow-hidden border ${getBackgroundClass()}`}
        style={{ 
          color: settings.textColorPreset === 'custom' ? settings.customTextColor : undefined,
          backgroundColor: (settings.backgroundStyle === 'glassmorphism' || settings.backgroundStyle === 'transparent') ? undefined : undefined
        }}
        id="preview-scroller-viewport"
      >
        {/* Soft layout background overlay to customize depth */}
        <div 
          className="absolute inset-0 bg-neutral-950 pointer-events-none transition-all duration-300" 
          style={{ opacity: settings.backgroundStyle === 'transparent' ? 0 : (100 - settings.bgOpacity) / 100 }} 
        />

        {/* Dynamic Studio Guide Indicators */}
        {settings.readingGuide && (
          <div className="absolute inset-y-0 left-0 right-0 pointer-events-none z-20 flex flex-col justify-center">
            {/* Focal Zone Band */}
            <div className="w-full h-12 bg-blue-500/10 border-y border-blue-500/30 flex items-center justify-between px-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg animate-pulse" />
              <div className="w-2 col-span-3 h-[1px] bg-blue-400/30 flex-1 mx-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg animate-pulse" />
            </div>
          </div>
        )}

        {/* Top/Bottom Fade mask for professional eye focus blend */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#000] to-transparent pointer-events-none z-10 opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#000] to-transparent pointer-events-none z-10 opacity-70" />

        {/* Live Actual Text Layout */}
        <div 
          ref={scrollRef}
          className={`w-full h-full overflow-y-auto px-6 py-16 scroll-smooth select-none relative ${getFontFamilyStyle()}`}
          id="live-scroller-active-body"
        >
          <div 
            className="space-y-4"
            style={{ 
              fontWeight: settings.fontWeight,
              lineHeight: settings.lineHeight,
              letterSpacing: settings.letterSpacing === 'tracking-tighter' ? 'tighter' :
                             settings.letterSpacing === 'tracking-tight' ? 'tight' :
                             settings.letterSpacing === 'tracking-normal' ? 'normal' :
                             settings.letterSpacing === 'tracking-wide' ? 'wide' : 'widest'
            }}
          >
            {activeScript.content.split('\n').map((paragraph, idx) => {
              const isEmpty = paragraph.trim() === '';
              if (isEmpty) return <div key={idx} className="h-4" />;
              
              return (
                <p 
                  key={idx}
                  className={`text-center text-sm md:text-base tracking-normal select-none transition-all duration-300 leading-normal ${getTextColorClass()}`}
                >
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Embedded Live Simulation Controls bottom row */}
      <div className={`flex items-center justify-between p-3 rounded-2xl border ${
        theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-neutral-100 border-zinc-200 text-neutral-800'
      }`} id="monitor-footer-dock">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleScroll}
            className={`flex items-center justify-center p-2 rounded-xl cursor-pointer transition-all duration-200 ${
              isScrolling
                ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                : (theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white border border-zinc-200 text-neutral-800 hover:bg-zinc-50')
            }`}
            title={isScrolling ? 'Pause Scroll' : 'Start Scroll'}
            id="preview-play-pause-btn"
          >
            {isScrolling ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
          </button>

          <button
            onClick={onResetScroll}
            className={`flex items-center justify-center p-2 rounded-xl transition-all duration-200 cursor-pointer ${
              theme === 'dark' 
                ? 'bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/15' 
                : 'bg-white border border-zinc-200 text-neutral-600 hover:text-neutral-950 hover:bg-zinc-50'
            }`}
            title="Reset position to top"
            id="preview-reset-btn"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed slider representation */}
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-mono uppercase ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Speed: {settings.scrollSpeed}x</span>
          <div className={`w-20 sm:w-28 h-1 rounded-full overflow-hidden relative ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-200'}`}>
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(settings.scrollSpeed / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-icon mapping component helper
function RefreshCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
