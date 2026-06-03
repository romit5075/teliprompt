/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Script {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export type FontFamily = 'Inter' | 'Poppins' | 'Manrope' | 'Outfit' | 'JetBrains Mono' | 'System';
export type FontWeight = '300' | '400' | '500' | '600' | '700' | '800';
export type LetterSpacing = 'tracking-tighter' | 'tracking-tight' | 'tracking-normal' | 'tracking-wide' | 'tracking-widest';
export type TextColorPreset = 'white' | 'yellow' | 'green' | 'cyan' | 'purple' | 'pink' | 'red' | 'custom';
export type BackgroundStyle = 'black' | 'dark-gray' | 'light-gray' | 'transparent' | 'glassmorphism' | 'gradient-cosmic' | 'gradient-cyber' | 'gradient-sunset';

export interface TeleprompterSettings {
  fontSize: number; // in pixels (e.g., 24px - 120px)
  fontFamily: FontFamily;
  fontWeight: FontWeight;
  lineHeight: number; // e.g. 1.2, 1.4, 1.6, 1.8, 2.0
  letterSpacing: LetterSpacing;
  textColorPreset: TextColorPreset;
  customTextColor: string; // hex
  backgroundStyle: BackgroundStyle;
  bgOpacity: number; // 0 to 100
  scrollSpeed: number; // 1 to 10 speed modifier
  focusMode: boolean; // 100% current line, 30% rest
  readingGuide: boolean; // show guide overlay
  readingMarkerStyle: 'line' | 'bracket' | 'zone' | 'none';
  mirrorHorizontal: boolean;
  mirrorVertical: boolean;
  theme: 'dark' | 'light'; // Global UI theme
  selectedScriptId: string;
}

export interface QuickTheme {
  id: string;
  name: string;
  description: string;
  textColorPreset: TextColorPreset;
  customTextColor?: string;
  backgroundStyle: BackgroundStyle;
  bgOpacity: number;
  fontSize?: number;
}
