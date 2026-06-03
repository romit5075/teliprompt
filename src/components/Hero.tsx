/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, PenTool, Sparkles, Tv, CheckCircle2, ChevronRight, Sliders, ArrowRight } from 'lucide-react';

interface HeroProps {
  theme: 'dark' | 'light';
  onStartWriting: () => void;
  onOpenTeleprompter: () => void;
}

export default function Hero({ theme, onStartWriting, onOpenTeleprompter }: HeroProps) {
  const [mockScrollProgress, setMockScrollProgress] = useState(0);
  const [isHoveredMock, setIsHoveredMock] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scrolling mockup system
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const scrollLoop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      setMockScrollProgress((prev) => {
        const next = prev + (isHoveredMock ? 0.04 : 0.015) * delta;
        return next > 320 ? 0 : next; // Reset back to top once scrolled far
      });

      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHoveredMock]);

  return (
    <section className="relative overflow-hidden py-16 md:py-24 px-8" id="hero-landing-page">
      {/* Background ambient light effects and Clean Minimal radial grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundColor: 'transparent', backgroundSize: '40px 40px' }} />
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[300px] md:h-[450px] bg-gradient-to-tr from-blue-600/10 to-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Intro Badge with subtle border to match modern layout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono mb-6 backdrop-blur-md ${
            theme === 'dark' 
              ? 'border-white/10 bg-white/5 text-white/80' 
              : 'border-zinc-200 bg-zinc-100 text-neutral-600'
          }`}
          id="hero-badge-container"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>FUSION MEDIA</span>
          <span className="w-1 h-1 rounded-full bg-blue-500" />
          <span className={`text-[10px] uppercase ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Clean Minimalism Theme</span>
        </motion.div>

        {/* Big Centered Headline with refined style */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-neutral-900'
          }`}
          id="hero-main-title"
        >
          Speak <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-600">Naturally.</span> <br className="hidden sm:inline" />
          Record <span className={`${theme === 'dark' ? 'text-white hover:text-blue-200' : 'text-neutral-900 hover:text-blue-600'} transition-colors duration-300`}>Confidently.</span>
        </motion.h1>

        {/* Premium Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-base sm:text-lg md:text-xl max-w-2xl mt-6 font-sans ${
            theme === 'dark' ? 'text-white/60' : 'text-neutral-600'
          }`}
          id="hero-subtitle-p"
        >
          Professional teleprompter designed for creators, coaches, influencers, educators, and business owners. Complete eye-level camera focus alignment.
        </motion.p>

        {/* Headline Call To Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full justify-center px-4"
          id="cta-buttons-container"
        >
          <button
            onClick={onStartWriting}
            className={`w-full sm:w-auto h-12 px-8 rounded-full font-sans font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer ${
              theme === 'dark'
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-neutral-950 text-white hover:bg-neutral-800'
            }`}
            id="start-writing-cta"
          >
            <PenTool className="w-4 h-4 transition-transform group-hover:rotate-6" />
            <span>Start Writing</span>
          </button>
          
          <button
            onClick={onOpenTeleprompter}
            className={`w-full sm:w-auto h-12 px-8 rounded-full font-sans font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer ${
              theme === 'dark' 
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-neutral-900'
            }`}
            id="open-prompter-cta"
          >
            <Play className="w-4 h-4 text-blue-400 fill-current" />
            <span>Open Teleprompter</span>
          </button>
        </motion.div>

        {/* Benefits bullets list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-xs font-mono ${
            theme === 'dark' ? 'text-white/40' : 'text-neutral-500'
          }`}
          id="hero-benefit-bullets"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            <span>No Account Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            <span>60 FPS Liquid Scrolling</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Saved Offline Safely</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Horizontal & Vertical Mirroring</span>
          </div>
        </motion.div>

        {/* FLOATING GLASS UI MOCKUP */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.4 }}
           className="w-full mt-16 px-2 sm:px-6 relative group"
           id="glass-ui-mockup-outer"
        >
          {/* Subtle ambient light backlighting */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-10 group-hover:opacity-15 transition duration-1000" />
          
          {/* Main Mockup Card Container matches the glassmorphic design */}
          <div 
            onMouseEnter={() => setIsHoveredMock(true)}
            onMouseLeave={() => setIsHoveredMock(false)}
            onClick={onOpenTeleprompter}
            className={`w-full rounded-3xl border shadow-2xl transition-all duration-500 cursor-pointer text-left overflow-hidden select-none relative p-6 bg-white/[0.02] border-white/10 backdrop-blur-2xl`}
            id="glass-ui-mockup-inner"
          >
            {/* Window control circles like macOS/Arc */}
            <div className="flex items-center justify-between border-b pb-4 mb-4 border-white/10">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="text-[11px] font-mono text-white/40 ml-3">live_teleprompter_preview.mp4</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  isHoveredMock 
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}>
                  {isHoveredMock ? 'SPEED 3.0x' : 'AUTOPLAY ENABLED'}
                </span>
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-semibold">Live Sync READY</span>
                </div>
              </div>
            </div>

            {/* Split Screen Mockup Visuals */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Left Mockup Panel - Mini Script List & Details */}
              <div className="md:col-span-2 space-y-4 pr-3 border-r border-white/10 hidden md:block">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest block">Script Editor</span>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="font-sans font-semibold text-sm text-white/80">YouTube Review Intro</div>
                  <div className="text-xs text-white/40 mt-1">158 Words • 01:09 Reading Time</div>
                </div>
                
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest block pt-1">Teleprompter Settings</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-center">
                    <span className="text-[9px] text-white/40 uppercase font-mono">Font Size</span>
                    <span className="text-xs font-mono font-bold text-white/80 block mt-0.5">48px</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-center">
                    <span className="text-[9px] text-white/40 uppercase font-mono">Family</span>
                    <span className="text-xs font-mono font-bold text-white/80 block mt-0.5">Outfit</span>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-center col-span-2">
                    <span className="text-[10px] text-blue-400 block font-semibold">Focus Mode Enabled</span>
                  </div>
                </div>
              </div>

              {/* Right Mockup Panel - Scrolling Simulator */}
              <div className="md:col-span-3 h-56 relative bg-black/90 rounded-2xl overflow-hidden border border-white/10 p-4">
                {/* Scroll masking to show dimming / focus */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10 opacity-90" />
                
                {/* Focus indicator band matches core theme styling */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-15">
                  <div className="w-full h-[60px] border-y border-blue-500/30 bg-blue-500/5"></div>
                  <div className="absolute left-3 w-1.5 h-8 bg-blue-500 rounded-full"></div>
                </div>

                {/* Animated scroll content container */}
                <div 
                  className="space-y-3 pt-12 transition-transform ease-out duration-100"
                  style={{ transform: `translateY(-${mockScrollProgress}px)` }}
                >
                  <p className="font-sans text-xl font-bold text-white/30 leading-normal">
                    This is how easy it is to communicate.
                  </p>
                  <p className="font-sans text-xl font-bold text-white leading-normal">
                    Keep perfect eye contact with your camera lens.
                  </p>
                  <p className="font-sans text-xl font-bold text-white/30 leading-normal">
                    No more looking down or forgetting key points.
                  </p>
                  <p className="font-sans text-xl font-bold text-white/20 leading-normal">
                    Designed flawlessly for video editors and creators.
                  </p>
                  <p className="font-sans text-xl font-bold text-white/10 leading-normal">
                    Simply tap Start, speak fluidly, and compile perfect takes.
                  </p>
                </div>
              </div>
            </div>

            {/* Hover overlay to enter applet */}
            <div className="absolute inset-0 bg-[#0A0A0A]/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px] z-20">
              <span className="px-6 py-2.5 rounded-full bg-white text-[#0A0A0A] font-sans font-semibold shadow-2xl scale-95 group-hover:scale-100 transition-transform duration-300 flex items-center gap-2 text-xs">
                <Sliders className="w-3.5 h-3.5" />
                Open teleprompter workspace
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
