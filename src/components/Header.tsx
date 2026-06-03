/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon, Sparkles, Tv, FileText, Info } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeTab: 'landing' | 'workspace';
  onNavigate: (tab: 'landing' | 'workspace') => void;
}

export default function Header({ theme, toggleTheme, activeTab, onNavigate }: HeaderProps) {
  return (
    <header className={`sticky top-0 z-50 w-full px-4 sm:px-8 py-4 transition-all duration-300 border-b ${
      theme === 'dark' 
        ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-white/10 text-white' 
        : 'bg-white/90 backdrop-blur-md border-zinc-200 text-neutral-900'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo and Name */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          id="fusion-media-logo-container"
        >
          <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300">
            <div className={`w-full h-full flex items-center justify-center rounded-[6px] ${
              theme === 'dark' ? 'bg-[#0A0A0A]' : 'bg-white'
            }`}>
              <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-purple-500" />
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg blur-sm opacity-20 group-hover:opacity-60 transition duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-outfit text-sm sm:text-lg font-semibold tracking-tight">
              <span className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>Fusion </span>
              <span className="text-zinc-400 font-medium hidden xs:inline">Media</span>
            </span>
          </div>
        </div>

        {/* Global Navigation Items */}
        <nav className="flex items-center gap-3 sm:gap-6" id="root-nav-menu">
          <button
            onClick={() => onNavigate('landing')}
            className={`font-sans text-xs sm:text-sm transition-colors cursor-pointer ${
              activeTab === 'landing'
                ? theme === 'dark' ? 'text-white font-medium' : 'text-neutral-950 font-medium'
                : theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-[#606060] hover:text-neutral-950'
            }`}
            id="nav-home-btn"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('workspace')}
            className={`font-sans text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer ${
              activeTab === 'workspace'
                ? theme === 'dark' ? 'text-white font-medium' : 'text-neutral-950 font-medium'
                : theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-[#606060] hover:text-neutral-950'
            }`}
            id="nav-workspace-btn"
          >
            <span className="hidden xs:inline">Studio</span> Workspace
          </button>

          <span className={`w-[1px] h-3 sm:h-4 ${theme === 'dark' ? 'bg-white/20' : 'bg-zinc-200'}`} />

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 sm:p-2 h-7 w-7 sm:h-8.5 sm:w-8.5 flex items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                : 'bg-zinc-100 border-zinc-200 text-neutral-800 hover:bg-zinc-200'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="theme-toggler-btn"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
