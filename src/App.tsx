/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import SettingsDrawer from './components/SettingsDrawer';
import TeleprompterView from './components/TeleprompterView';
import { Script, TeleprompterSettings, QuickTheme } from './types';
import { DEFAULT_SCRIPTS } from './data';
import { Sliders, Settings, Tv, Sparkles, AlertCircle } from 'lucide-react';

const STORAGE_SCRIPTS_KEY = 'fusion_media_scripts';
const STORAGE_SETTINGS_KEY = 'fusion_media_settings';

const INITIAL_SETTINGS: TeleprompterSettings = {
  fontSize: 48,
  fontFamily: 'Outfit',
  fontWeight: '600',
  lineHeight: 1.5,
  letterSpacing: 'tracking-normal',
  textColorPreset: 'cyan',
  customTextColor: '#00D2FF',
  backgroundStyle: 'gradient-cosmic',
  bgOpacity: 95,
  scrollSpeed: 3.5,
  focusMode: true,
  readingGuide: true,
  readingMarkerStyle: 'line',
  mirrorHorizontal: false,
  mirrorVertical: false,
  theme: 'dark',
  selectedScriptId: 'script-welcome'
};

export default function App() {
  // Global States
  const [activeTab, setActiveTab] = useState<'landing' | 'workspace'>('landing');
  const [workspaceTab, setWorkspaceTab] = useState<'editor' | 'preview'>('editor');
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScriptId, setSelectedScriptId] = useState<string>('script-welcome');
  const [settings, setSettings] = useState<TeleprompterSettings>(INITIAL_SETTINGS);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  
  // Drawer & Overlay Dialog toggles
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isTeleprompterViewOpen, setIsTeleprompterViewOpen] = useState<boolean>(false);

  // Initialize scripts and configurations from LocalStorage
  useEffect(() => {
    setIsDrawerOpen(window.innerWidth >= 1024);
    const rawScripts = localStorage.getItem(STORAGE_SCRIPTS_KEY);
    if (rawScripts) {
      try {
        const parsed = JSON.parse(rawScripts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setScripts(parsed);
          setSelectedScriptId(parsed[0].id);
        } else {
          setScripts(DEFAULT_SCRIPTS);
          setSelectedScriptId(DEFAULT_SCRIPTS[0].id);
        }
      } catch (e) {
        setScripts(DEFAULT_SCRIPTS);
        setSelectedScriptId(DEFAULT_SCRIPTS[0].id);
      }
    } else {
      setScripts(DEFAULT_SCRIPTS);
      setSelectedScriptId(DEFAULT_SCRIPTS[0].id);
    }

    const rawSettings = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (rawSettings) {
      try {
        const parsed = JSON.parse(rawSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        // Fallback to defaults
      }
    }
  }, []);

  // Save changes to localStorage on scripts updates
  useEffect(() => {
    if (scripts.length > 0) {
      localStorage.setItem(STORAGE_SCRIPTS_KEY, JSON.stringify(scripts));
    }
  }, [scripts]);

  // Save changed settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    
    // Dynamically insert/remove the light-theme class to HTML core layout
    const html = document.documentElement;
    if (settings.theme === 'light') {
      html.classList.add('light-theme');
      html.style.backgroundColor = '#FFFFFF';
    } else {
      html.classList.remove('light-theme');
      html.style.backgroundColor = '#0A0A0A';
    }
  }, [settings.theme, settings]);

  // Handle hotkeys (Spacebar toggles scrolling, Escape closes prompter modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Manage keys only if the teleprompter window is active
      if (isTeleprompterViewOpen) {
        if (e.code === 'Space') {
          e.preventDefault(); // Stop standard page offsets jumping
          setIsScrolling(prev => !prev);
        }
        if (e.code === 'Escape') {
          setIsScrolling(false);
          setIsTeleprompterViewOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTeleprompterViewOpen]);

  // Helper actions for user interactions
  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const handleUpdateScript = (id: string, title: string, content: string) => {
    setScripts(prev => prev.map(s => s.id === id ? { ...s, title, content, lastModified: Date.now() } : s));
  };

  const handleSelectScript = (id: string) => {
    setSelectedScriptId(id);
    setIsScrolling(false);
  };

  const handleCreateScript = () => {
    const newId = `script-${Date.now()}`;
    const newScript: Script = {
      id: newId,
      title: 'Untitled Drafting Script',
      content: 'Write your story lines here...',
      lastModified: Date.now()
    };
    setScripts(prev => [newScript, ...prev]);
    setSelectedScriptId(newId);
    setIsScrolling(false);
  };

  const handleDeleteScript = (id: string) => {
    if (scripts.length <= 1) return; // safeguard: keep at least 1 script
    setScripts(prev => {
      const filtered = prev.filter(s => s.id !== id);
      // Select another active script
      if (selectedScriptId === id) {
        setSelectedScriptId(filtered[0].id);
      }
      return filtered;
    });
    setIsScrolling(false);
  };

  const updateSettingsObject = (updates: Partial<TeleprompterSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Click quick-presets themes -> update typography + colors instantly
  const handleApplyThemePreset = (themePreset: QuickTheme) => {
    updateSettingsObject({
      textColorPreset: themePreset.textColorPreset,
      backgroundStyle: themePreset.backgroundStyle,
      bgOpacity: themePreset.bgOpacity,
      ...(themePreset.fontSize && { fontSize: themePreset.fontSize }),
      ...(themePreset.customTextColor && { customTextColor: themePreset.customTextColor })
    });
  };

  // Get active selected script object helper
  const activeScript = scripts.find(s => s.id === selectedScriptId) || scripts[0] || {
    id: 'placeholder',
    title: 'Loading script...',
    content: '',
    lastModified: Date.now()
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      settings.theme === 'dark' ? 'bg-[#0A0A0A] text-white' : 'bg-[#F8F9FB] text-neutral-900'
    }`}>
      {/* Header component present on all views */}
      <Header 
        theme={settings.theme} 
        toggleTheme={toggleTheme} 
        activeTab={activeTab}
        onNavigate={setActiveTab}
      />

      {/* Main layout switch based on tabs */}
      <main className="flex-1 flex flex-col relative">
        {activeTab === 'landing' ? (
          /* Landing Hero Screen with premium animations */
          <Hero 
            theme={settings.theme}
            onStartWriting={() => {
              setActiveTab('workspace');
              setIsDrawerOpen(window.innerWidth >= 1024);
            }}
            onOpenTeleprompter={() => {
              setActiveTab('workspace');
              setIsTeleprompterViewOpen(true);
            }}
          />
        ) : (
          /* WORKSPACE VIEW WITH SPLIT DESIGN & CONFIGS */
          <div className="flex-1 flex flex-col p-4 md:p-6 gap-2 sm:gap-4 relative max-w-7xl mx-auto w-full">
            
            {/* Mobile/Tablet Segmented Toggle Workspace Switcher */}
            <div className={`lg:hidden flex p-1 border rounded-full w-full max-w-xs sm:max-w-sm mx-auto mb-4 transition-colors ${
              settings.theme === 'dark' 
                ? 'bg-neutral-900/80 border-white/10 text-white' 
                : 'bg-neutral-100 border-zinc-200 text-neutral-800'
            }`} id="segmented-tab-switch">
              <button
                onClick={() => setWorkspaceTab('editor')}
                className={`flex-1 py-1.5 sm:py-2 text-xs font-semibold rounded-full transition-all cursor-pointer text-center ${
                  workspaceTab === 'editor'
                    ? 'bg-blue-600 text-white shadow-md'
                    : settings.theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Script Studio
              </button>
              <button
                onClick={() => setWorkspaceTab('preview')}
                className={`flex-1 py-1.5 sm:py-2 text-xs font-semibold rounded-full transition-all cursor-pointer text-center ${
                  workspaceTab === 'preview'
                    ? 'bg-blue-600 text-white shadow-md'
                    : settings.theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Studio Monitor
              </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 relative w-full">
              {/* Left Column: Rich Editor Panel */}
              <div className={`flex-grow flex-shrink basis-2/5 min-w-[300px] h-[calc(100vh-230px)] sm:h-[calc(100vh-200px)] lg:h-[calc(100vh-160px)] min-h-[450px] md:min-h-[500px] transition-all duration-300 ${
                workspaceTab === 'editor' ? 'block' : 'hidden lg:block'
              }`}>
                <EditorPanel 
                  theme={settings.theme}
                  scripts={scripts}
                  selectedScriptId={selectedScriptId}
                  onSelectScript={handleSelectScript}
                  onUpdateScript={handleUpdateScript}
                  onCreateScript={handleCreateScript}
                  onDeleteScript={handleDeleteScript}
                  settings={settings}
                  onApplyTheme={handleApplyThemePreset}
                />
              </div>

              {/* Right Column: Live Teleprompter Preview Simulator */}
              <div className={`flex-grow flex-shrink basis-2/5 min-w-[300px] h-[calc(100vh-230px)] sm:h-[calc(100vh-200px)] lg:h-[calc(100vh-160px)] min-h-[450px] md:min-h-[500px] transition-all duration-300 ${
                workspaceTab === 'preview' ? 'block' : 'hidden lg:block'
              }`}>
                <PreviewPanel 
                  theme={settings.theme}
                  settings={settings}
                  activeScript={activeScript}
                  isScrolling={isScrolling}
                  onToggleScroll={() => setIsScrolling(prev => !prev)}
                  onResetScroll={() => setIsScrolling(false)}
                  onOpenWorkspacePrompter={() => {
                    setIsTeleprompterViewOpen(true);
                    setIsScrolling(false);
                  }}
                />
              </div>
            </div>

            {/* Mobile/Tablet Backdrop dismiss for Drawer when open */}
            {isDrawerOpen && (
              <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
                onClick={() => setIsDrawerOpen(false)}
              />
            )}

            {/* Quick floating drawer settings trigger icon positioned inside Workspace */}
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className={`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-30 p-4 rounded-full border shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all ${
                isDrawerOpen
                  ? 'bg-blue-600 text-white border-blue-500'
                  : settings.theme === 'dark'
                    ? 'bg-black text-white/80 border-white/10 hover:bg-white/10'
                    : 'bg-neutral-900 border-zinc-800 text-white hover:bg-neutral-800'
              }`}
              title="Toggle settings drawer panel"
              id="sticky-drawer-setting-toggle"
            >
              <Settings className={`w-6 h-6 ${isDrawerOpen ? 'rotate-45' : 'animate-spin'}`} style={{ animationDuration: '6s' }} />
            </button>

            {/* Sidebar Typography Settings Drawer Panel */}
            <SettingsDrawer 
              theme={settings.theme}
              settings={settings}
              onUpdateSettings={updateSettingsObject}
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
            />
          </div>
        )}
      </main>

      {/* DRAGGABLE, ULTRA-SMOOTH AUTO-SCROLL TELEPROMPTER WRAPPER OVERLAY */}
      {isTeleprompterViewOpen && (
        <TeleprompterView 
          theme={settings.theme}
          settings={settings}
          activeScript={activeScript}
          isScrolling={isScrolling}
          onToggleScroll={(status) => setIsScrolling(status !== undefined ? status : !isScrolling)}
          onResetScroll={() => setIsScrolling(false)}
          onUpdateSettings={updateSettingsObject}
          onClose={() => {
            setIsTeleprompterViewOpen(false);
            setIsScrolling(false);
          }}
        />
      )}
    </div>
  );
}
