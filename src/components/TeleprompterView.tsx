/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TeleprompterSettings, Script } from '../types';
import { 
  Play, Pause, RotateCcw, Maximize2, Minimize2, Settings, 
  FlipHorizontal, FlipVertical, GripHorizontal, Eye, Sliders, ChevronDown 
} from 'lucide-react';

interface TeleprompterViewProps {
  theme: 'dark' | 'light';
  settings: TeleprompterSettings;
  activeScript: Script;
  isScrolling: boolean;
  onToggleScroll: (status?: boolean) => void;
  onResetScroll: () => void;
  onUpdateSettings: (updates: Partial<TeleprompterSettings>) => void;
  onClose: () => void;
}

export default function TeleprompterView({
  theme,
  settings,
  activeScript,
  isScrolling,
  onToggleScroll,
  onResetScroll,
  onUpdateSettings,
  onClose
}: TeleprompterViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [floatY, setFloatY] = useState(120); // vertical float coordinate of the glass panel
  const [isControlsExpanded, setIsControlsExpanded] = useState(true);

  // Monitor screen size for full-touch layout triggers
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const useFullLayout = isFullscreen || isMobile;

  // Dynamic Touch Gestures for mobile
  // Swipe Up/Down -> speed. Double tap -> Pause. Long Press -> settings open
  const touchStartY = useRef(0);
  const lastTapTime = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && touchStartY.current !== 0) {
      const diffY = touchStartY.current - e.touches[0].clientY;
      // If swipe up (diffY > 40) speed goes up. If swipe down (diffY < -40) speed goes down.
      if (diffY > 50) {
        onUpdateSettings({ scrollSpeed: Math.min(10, settings.scrollSpeed + 0.5) });
        touchStartY.current = e.touches[0].clientY; // throttle/reset
      } else if (diffY < -50) {
        onUpdateSettings({ scrollSpeed: Math.max(1, settings.scrollSpeed - 0.5) });
        touchStartY.current = e.touches[0].clientY;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchStartY.current = 0;
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTapTime.current < DOUBLE_PRESS_DELAY) {
      onToggleScroll();
    }
    lastTapTime.current = now;
  };

  // High Performance 60 FPS requestAnimationFrame Scroller
  useEffect(() => {
    if (!isScrolling || !scrollRef.current) return;

    let animId: number;
    let lastStamp = performance.now();
    let currentPos = scrollRef.current.scrollTop;

    const scrollLoop = (now: number) => {
      const elapsed = now - lastStamp;
      lastStamp = now;

      if (scrollRef.current) {
        // Core displacement: Speed 1x to 10x is mapped smoothly to pixels per millisecond
        // 1x -> ~0.03px/ms, 10x -> ~0.50px/ms.
        const speedMultiplier = 0.02 + (settings.scrollSpeed * 0.038);
        const displacement = speedMultiplier * elapsed;
        
        currentPos += displacement;
        scrollRef.current.scrollTop = currentPos;

        // Auto stop or wrap scroll at the absolute end parameters
        if (
          scrollRef.current.scrollTop >= 
          (scrollRef.current.scrollHeight - scrollRef.current.clientHeight)
        ) {
          onToggleScroll(false); // Pause scroll smoothly
        }
      }

      animId = requestAnimationFrame(scrollLoop);
    };

    animId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animId);
  }, [isScrolling, settings.scrollSpeed, activeScript.content]);

  // Handle position reset physically
  const handleReset = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    onResetScroll();
  };

  // Preset Text Color Class mapping
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

  // Background visual themes mapping
  const getBackgroundClass = () => {
    switch (settings.backgroundStyle) {
      case 'black': return 'bg-[#000000]';
      case 'dark-gray': return 'bg-[#121212]';
      case 'light-gray': return 'bg-[#EFF1F5] text-neutral-800';
      case 'transparent': return 'bg-transparent border-2 border-white/10 border-dashed';
      case 'glassmorphism': return 'bg-white/[0.02] backdrop-blur-3xl border border-white/10';
      case 'gradient-cosmic': return 'bg-gradient-to-b from-[#12012F] via-[#040108] to-[#01091F]';
      case 'gradient-cyber': return 'bg-gradient-to-b from-[#09151C] via-[#05060A] to-[#140620]';
      case 'gradient-sunset': return 'bg-gradient-to-b from-[#1F0A1B] via-[#0D0514] to-[#050F18]';
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

  // Convert letter spacing
  const getTrackingClass = () => {
    return settings.letterSpacing;
  };

  // Custom Mirror Reflections mapping
  const getMirrorClass = () => {
    if (settings.mirrorHorizontal && settings.mirrorVertical) return 'mirror-both';
    if (settings.mirrorHorizontal) return 'mirror-h';
    if (settings.mirrorVertical) return 'mirror-v';
    return '';
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-500 overflow-hidden ${
        isFullscreen ? 'bg-black/98' : 'bg-black/75 backdrop-blur-md'
      }`}
      id="teleprompter-modal-wrapper"
    >
      {/* Immersive Top Control Strip */}
      <div className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-4 sm:px-6 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2 sm:gap-3 max-w-[40%] sm:max-w-none shrink">
          <div className="relative w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5 shrink-0">
            <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center">
              <span className="font-sans text-[10px] sm:text-xs font-bold text-white">FM</span>
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="font-sans text-xs sm:text-sm font-bold text-white tracking-tight truncate">
              {activeScript.title}
            </h2>
            <p className="text-[9px] font-mono text-white/40 uppercase hidden xs:block truncate">
              {isFullscreen ? 'IMMERSIVE FULLSCREEN MODE' : 'PROMPTER VIEWPORT'}
            </p>
          </div>
        </div>

        {/* Global Action Keys top row */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mirror status quick-toggles in modal */}
          <button
            onClick={() => onUpdateSettings({ mirrorHorizontal: !settings.mirrorHorizontal })}
            className={`p-1.5 sm:p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
              settings.mirrorHorizontal 
                ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' 
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
            title="Mirror Horizontally"
          >
            <FlipHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          
          <button
            onClick={() => onUpdateSettings({ mirrorVertical: !settings.mirrorVertical })}
            className={`p-1.5 sm:p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
              settings.mirrorVertical 
                ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' 
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
            title="Mirror Vertically"
          >
            <FlipVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Inline Fullscreen toggler */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-1.5 sm:p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
              isFullscreen 
                ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            id="modal-fullscreen-toggle"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          <span className="w-0.5 h-4 bg-white/10" />

          {/* Close modal and return back to studio */}
          <button
            onClick={onClose}
            className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-all cursor-pointer"
            id="modal-close-studio-btn"
          >
            Close<span className="hidden sm:inline"> Workspace</span>
          </button>
        </div>
      </div>

      {/* DRAGGABLE TELEPROMPTER VIEWPORT CONTAINER */}
      {/* Constraints: Locked to dragging on Y axis (Up/Down) only, Centered horizontally */}
      <motion.div 
        drag={useFullLayout ? false : "y"}
        dragConstraints={{ top: -140, bottom: 250 }}
        dragElastic={0.1}
        dragMomentum={false}
        className={`w-full max-w-4xl p-4 sm:p-6 shadow-2xl flex flex-col relative pointer-events-auto transition-all duration-300 select-none ${
          useFullLayout 
            ? 'rounded-none h-full w-full min-h-screen max-w-none border-none' 
            : 'rounded-3xl min-h-[350px] md:min-h-[480px]'
        } ${getBackgroundClass()}`}
        style={{ 
          color: settings.textColorPreset === 'custom' ? settings.customTextColor : undefined,
          boxShadow: useFullLayout ? 'none' : '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
          y: useFullLayout ? 0 : floatY
        }}
        onDrag={(event, info) => {
          if (!useFullLayout) {
            setFloatY(info.point.y - 200);
          }
        }}
        id="draggable-prompter-glass"
      >
        {/* Soft layout background opacity overlay */}
        <div 
          className={`absolute inset-0 bg-[#000000] pointer-events-none transition-all duration-300 z-0 ${
            useFullLayout ? 'rounded-none' : 'rounded-3xl'
          }`} 
          style={{ opacity: settings.backgroundStyle === 'transparent' ? 0 : (100 - settings.bgOpacity) / 100 }} 
        />

        {/* Drag handle guide at the top of the glass */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-row-resize z-30 select-none pb-4 w-full">
          <GripHorizontal className="w-5 h-5 text-white/30 animate-pulse" />
          <span className="text-[8px] font-mono tracking-widest text-white/40 uppercase -mt-0.5 font-bold">
            DRAG VERTICALLY TO ALIGN WITH CAMERA LENS
          </span>
        </div>

        {/* Dynamic Studio Guide Indicators */}
        {settings.readingGuide && (
          <div className="absolute inset-y-0 left-0 right-0 pointer-events-none z-20 flex flex-col justify-center">
            {/* Focal Alignment Zone Bar */}
            <div className="w-full h-16 bg-blue-500/10 border-y border-blue-500/30 flex items-center justify-between px-4">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-md shadow-blue-500/50 animate-pulse" />
              <div className="h-[1px] bg-gradient-to-r from-blue-500/10 via-blue-500/30 to-blue-500/10 flex-1 mx-2" />
              <span className="text-[9px] font-mono text-blue-400 font-bold tracking-widest uppercase px-2.5 py-1 hidden sm:block bg-black/80 rounded-full border border-white/5">
                EYE LEVEL INDICATOR ZONE
              </span>
              <div className="h-[1px] bg-gradient-to-r from-blue-500/10 via-blue-500/30 to-blue-500/10 flex-1 mx-2" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-md shadow-blue-500/50 animate-pulse" />
            </div>
          </div>
        )}

        {/* High focus overlay gradient masking (Dims top/bottom to 30%, or full contrast) */}
        {settings.focusMode ? (
          <>
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#000000] via-[#000000]/60 to-transparent pointer-events-none z-10 rounded-t-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent pointer-events-none z-10 rounded-b-3xl" />
          </>
        ) : (
          <>
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
          </>
        )}

        {/* Raw Text Flow Viewport Container */}
        <div 
          ref={scrollRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleDoubleTap}
          className={`w-full flex-1 overflow-y-auto px-8 md:px-16 py-32 cursor-pointer relative z-0 scrollbar-none rounded-2xl select-none ${getFontFamilyStyle()} ${getMirrorClass()}`}
          id="prompter-scroller-window"
        >
          <div 
            className="space-y-8 select-none"
            style={{ 
              fontSize: `${settings.fontSize}px`,
              fontWeight: settings.fontWeight,
              lineHeight: settings.lineHeight,
              letterSpacing: getTrackingClass() === 'tracking-tighter' ? 'tighter' :
                             getTrackingClass() === 'tracking-tight' ? 'tight' :
                             getTrackingClass() === 'tracking-normal' ? 'normal' :
                             getTrackingClass() === 'tracking-wide' ? 'wide' : 'widest'
            }}
          >
            {activeScript.content.split('\n').map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (trimmed === '') return <div key={index} className="h-8" />;
              
              return (
                <p 
                  key={index}
                  className={`text-center tracking-normal leading-normal select-none transition-opacity duration-300 ${getTextColorClass()}`}
                >
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* FLOATING ACTION MEDIA CONTROLS DOCK (At Bottom) */}
      <div 
        className="absolute bottom-4 sm:bottom-6 inset-x-0 max-w-2xl mx-auto px-2 sm:px-4 z-50 pointer-events-auto"
        id="bottom-media-controls-wrap"
      >
        <div className="w-full rounded-2xl sm:rounded-3xl bg-black/80 border border-white/10 backdrop-blur-xl p-3 sm:p-4 shadow-2xl flex flex-col gap-2.5 sm:gap-3">
          {/* Expandable options menu */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Start / Pause Scrolling toggle */}
              <button
                onClick={() => onToggleScroll()}
                className={`flex items-center justify-center h-10.5 w-10.5 sm:h-10 sm:w-28 rounded-xl sm:rounded-2xl font-sans font-semibold text-sm cursor-pointer transition-all duration-300 ${
                  isScrolling
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                    : 'bg-white text-black hover:bg-zinc-200'
                }`}
                id="media-play-pause-btn"
              >
                {isScrolling ? (
                  <span className="flex items-center gap-2">
                    <Pause className="w-4 h-4 fill-current shrink-0" />
                    <span className="hidden sm:inline">Pause</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2 animate-pulse">
                    <Play className="w-4 h-4 fill-current shrink-0" />
                    <span className="hidden sm:inline">Scroll</span>
                  </span>
                )}
              </button>

              {/* Reset Scroll position */}
              <button
                onClick={handleReset}
                className="flex items-center justify-center h-10.5 w-10.5 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/15 transition-all cursor-pointer shrink-0"
                title="Reset to absolute top"
                id="media-reset-btn"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Speeds Controller slider indicator */}
            <div className="flex-1 max-w-[140px] sm:max-w-[280px] flex items-center gap-1.5 sm:gap-3 min-w-0">
              <span className="text-[9px] sm:text-xs font-mono text-white/40 uppercase shrink-0">
                Speed: <span className="text-blue-400 font-bold font-mono">{settings.scrollSpeed}x</span>
              </span>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={settings.scrollSpeed}
                onChange={(e) => onUpdateSettings({ scrollSpeed: parseFloat(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 min-w-0"
              />
            </div>

            {/* Quick mini settings drawer togglers */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={() => onUpdateSettings({ focusMode: !settings.focusMode })}
                className={`p-2 h-10.5 w-10.5 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl sm:rounded-2xl border text-xs cursor-pointer transition-colors ${
                  settings.focusMode 
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                }`}
                title="Toggle Focus Reading opacity mask"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => onUpdateSettings({ readingGuide: !settings.readingGuide })}
                className={`p-2 h-10.5 w-10.5 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl sm:rounded-2xl border text-xs cursor-pointer transition-colors ${
                  settings.readingGuide 
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                }`}
                title="Toggle Center Eye-Level Guide indicator"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick instructions subtitle info bar */}
          <div className="flex flex-col md:flex-row items-center justify-between text-[9px] gap-1 font-mono text-white/40 border-t pt-2 border-white/10">
            <span className="hidden md:inline">🔑 KEYS: [SPACEBAR] play/pause • [ESC] close prompter</span>
            <span className="text-center md:text-right w-full md:w-auto">📱 MOBILE: Swipe UP/DOWN speed • Double Tap play/pause</span>
          </div>
        </div>
      </div>
    </div>
  );
}
