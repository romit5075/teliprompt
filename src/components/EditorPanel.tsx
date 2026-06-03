/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Script, QuickTheme, TeleprompterSettings } from '../types';
import { 
  FileText, Plus, Trash2, Clock, AlignLeft, 
  Sparkles, Layers, RefreshCw, ChevronDown 
} from 'lucide-react';
import { QUICK_THEMES } from '../data';

interface EditorPanelProps {
  theme: 'dark' | 'light';
  scripts: Script[];
  selectedScriptId: string;
  onSelectScript: (id: string) => void;
  onUpdateScript: (id: string, title: string, content: string) => void;
  onCreateScript: () => void;
  onDeleteScript: (id: string) => void;
  settings: TeleprompterSettings;
  onApplyTheme: (theme: QuickTheme) => void;
}

export default function EditorPanel({
  theme,
  scripts,
  selectedScriptId,
  onSelectScript,
  onUpdateScript,
  onCreateScript,
  onDeleteScript,
  settings,
  onApplyTheme
}: EditorPanelProps) {
  const currentScript = scripts.find(s => s.id === selectedScriptId) || scripts[0];
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  // Calculations
  const wordCount = currentScript ? currentScript.content.trim() ? currentScript.content.trim().split(/\s+/).length : 0 : 0;
  const charCount = currentScript ? currentScript.content.length : 0;
  
  // Calculate speaking duration @ 140 WPM
  const getSpeakingTime = (words: number) => {
    if (words === 0) return '0s';
    const totalSeconds = Math.ceil((words / 140) * 60);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const handleTitleBlur = () => {
    setEditingTitle(false);
    if (tempTitle.trim() && currentScript) {
      onUpdateScript(currentScript.id, tempTitle, currentScript.content);
    }
  };

  const startEditingTitle = () => {
    if (currentScript) {
      setTempTitle(currentScript.title);
      setEditingTitle(true);
    }
  };

  return (
    <div 
      className={`rounded-3xl border p-6 flex flex-col h-full gap-5 transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-white/[0.02] border-white/10 text-white shadow-xl shadow-black/30' 
          : 'bg-[#F8F9FB] border-zinc-200 text-neutral-800 shadow-sm'
      }`}
      id="left-editor-panel-container"
    >
      {/* Panel Title & Scripts Switcher Header */}
      <div className={`flex items-center justify-between border-b pb-4 ${theme === 'dark' ? 'border-white/10' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          <h2 className="font-sans font-bold text-base tracking-tight">Script Studio</h2>
        </div>
        <button
          onClick={onCreateScript}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all duration-200 cursor-pointer ${
            theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-neutral-900 text-white hover:bg-neutral-800'
          }`}
          id="btn-create-new-script"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Script</span>
        </button>
      </div>

      {/* Script Manager Selection Column */}
      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
        {scripts.map((script) => (
          <div
            key={script.id}
            className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 border text-xs ${
              script.id === selectedScriptId
                ? (theme === 'dark' ? 'bg-blue-600/15 border-blue-500/30 text-white' : 'bg-blue-50 border-blue-200 text-blue-600 font-semibold')
                : (theme === 'dark' ? 'bg-white/5 border-transparent text-white/60 hover:bg-white/10' : 'bg-zinc-100 border-transparent text-neutral-500 hover:bg-zinc-200/60 hover:text-neutral-900')
            }`}
            id={`script-item-${script.id}`}
          >
            <button
              onClick={() => {
                onSelectScript(script.id);
                setEditingTitle(false);
              }}
              className="flex-1 text-left truncate font-medium cursor-pointer"
            >
              {script.title}
            </button>
            {scripts.length > 1 && (
              <button
                onClick={() => onDeleteScript(script.id)}
                className={`p-1 rounded transition-colors ml-2 cursor-pointer ${
                  theme === 'dark' ? 'text-white/40 hover:text-red-400' : 'text-neutral-400 hover:text-red-500'
                }`}
                title="Delete script"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Editable Title Section */}
      {currentScript && (
        <div className="flex flex-col gap-3">
          {editingTitle ? (
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleBlur();
                if (e.key === 'Escape') setEditingTitle(false);
              }}
              autoFocus
              className={`w-full border rounded-xl px-3 py-2 text-sm font-sans font-medium focus:outline-none focus:border-blue-500 ${
                theme === 'dark' ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-zinc-200 text-neutral-800'
              }`}
              placeholder="Script Title..."
            />
          ) : (
            <div className="flex items-center justify-between group">
              <h3 
                onClick={startEditingTitle}
                className={`text-sm font-bold font-sans truncate pb-1 border-b border-dashed border-transparent cursor-pointer flex-1 ${
                  theme === 'dark' ? 'text-white/90 hover:border-white/35' : 'text-neutral-800 hover:border-zinc-400'
                }`}
                title="Click to edit title"
              >
                {currentScript.title}
              </h3>
            </div>
          )}

          {/* Quick Real-Time Metrics Badges */}
          <div className="grid grid-cols-3 gap-2 pb-1">
            <div className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-neutral-100/60 border-zinc-200'
            }`}>
              <span className={`text-[9px] font-mono uppercase tracking-wider ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Words</span>
              <span className={`text-sm font-sans font-bold mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                {wordCount}
              </span>
            </div>
            
            <div className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-neutral-100/60 border-zinc-200'
            }`}>
              <span className={`text-[9px] font-mono uppercase tracking-wider ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>Chars</span>
              <span className={`text-sm font-sans font-bold mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                {charCount}
              </span>
            </div>
            
            <div className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${
              theme === 'dark' ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'
            }`}>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-500" />
                <span className="text-[9px] font-mono text-blue-500 uppercase tracking-wider font-semibold">Time</span>
              </div>
              <span className="text-sm font-sans font-bold text-blue-500 mt-0.5">
                {getSpeakingTime(wordCount)}
              </span>
            </div>
          </div>

          {/* Core Text Editor Area */}
          <div className="relative flex-1 flex flex-col gap-1.5 min-h-[280px]">
            <label className={`text-[10px] uppercase font-mono tracking-widest font-semibold ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>
              Edit Script Content
            </label>
            <textarea
              value={currentScript.content}
              onChange={(e) => onUpdateScript(currentScript.id, currentScript.title, e.target.value)}
              className={`w-full flex-1 p-4 rounded-2xl resize-none font-sans text-sm leading-relaxed border transition-all duration-300 focus:outline-none focus:ring-1 ${
                theme === 'dark' 
                  ? 'bg-black/30 border-white/10 focus:border-blue-500 focus:ring-blue-500 text-white/90' 
                  : 'bg-white border-zinc-200 focus:border-blue-500 focus:ring-blue-500 text-neutral-800'
              }`}
              placeholder="Type or copy-paste your production script here. The layout previews on the right and floating telepronter viewport sync immediately!"
              id="script-editor-textarea"
            />
          </div>
        </div>
      )}

      {/* Quick Visual Presets / Themes Carousel */}
      <div className={`mt-1 border-t pt-4 ${theme === 'dark' ? 'border-white/10' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/50' : 'text-neutral-500'}`}>
            Aesthetic Quick Themes
          </span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {QUICK_THEMES.map((qTheme) => {
            const isActive = settings.textColorPreset === qTheme.textColorPreset && 
                             settings.backgroundStyle === qTheme.backgroundStyle;
            return (
              <button
                key={qTheme.id}
                onClick={() => onApplyTheme(qTheme)}
                className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all duration-200 group relative flex flex-col justify-between h-14 ${
                  isActive
                    ? (theme === 'dark' ? 'border-blue-500 bg-blue-600/10' : 'border-blue-500 bg-blue-50')
                    : (theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-zinc-200 bg-white hover:bg-zinc-50 shadow-xs')
                }`}
                title={qTheme.description}
                id={`quick-theme-${qTheme.id}`}
              >
                <div className={`font-sans text-[11px] font-bold truncate pr-3 ${theme === 'dark' ? 'text-white/90' : 'text-neutral-800'}`}>
                  {qTheme.name}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    qTheme.textColorPreset === 'white' ? 'bg-zinc-400 dark:bg-white' :
                    qTheme.textColorPreset === 'yellow' ? 'bg-yellow-400' :
                    qTheme.textColorPreset === 'green' ? 'bg-emerald-400' :
                    qTheme.textColorPreset === 'cyan' ? 'bg-cyan-400' : 'bg-purple-400'
                  }`} />
                  <span className={`text-[9px] font-mono capitalize ${theme === 'dark' ? 'text-white/40' : 'text-neutral-500'}`}>
                    {qTheme.backgroundStyle.replace('gradient-', '')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
