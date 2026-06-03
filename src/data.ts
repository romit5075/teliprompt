/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Script, QuickTheme } from './types';

export const DEFAULT_SCRIPTS: Script[] = [
  {
    id: 'script-welcome',
    title: 'Welcome to Fusion Media Teleprompter',
    content: `Welcome to Fusion Media – the ultimate professional-grade teleprompter designed specifically for modern content creators, educators, coaches, and professionals.

This is a live preview of how your text will scroll. 

With Fusion Media, you can speak naturally and record confidently. No more memorizing long scripts or awkward pauses.

Feel free to edit this text on the left panel. As you type, the preview panel automatically keeps everything in perfect sync.

Try adjusting the scroll speed, changing the fonts, or activating "Focus Reading Mode" in the settings panel to keep perfect eye contact with your camera lens.

Bring your presentation to the next level with Fusion Media!`,
    lastModified: Date.now(),
  },
  {
    id: 'script-youtube',
    title: 'YouTube Tech Review Intro',
    content: `What is up, everyone! Welcome back to the channel.

Today, we are taking a look at a piece of tech that completely changes the game for creators. 

If you have ever struggled with looking directly at the camera while remembering what you want to say, this video is exactly for you.

Before we jump in, make sure to smash that subscribe button and hit the notification bell so you never miss an electronic update. Let's get into it!`,
    lastModified: Date.now() - 3600000,
  },
  {
    id: 'script-business',
    title: 'Product Pitch & Keynotes',
    content: `Good morning, everyone. Thank you for joining us today.

Today, we are incredibly thrilled to introduce the next generation of our creative workspace platforms. 

We built this solution to directly address the key challenges high-performing media houses face: disconnected editing pipelines and steep onboarding curves.

Our mission is simple: to democratize beautiful design and high-frame-rate publishing for teams worldwide.

By merging intelligent script assistance with state-of-the-art teleprompting overlays, we have established a new standard. Let us walk you through the key live demonstration.`,
    lastModified: Date.now() - 7200000,
  }
];

export const QUICK_THEMES: QuickTheme[] = [
  {
    id: 'theme-classic',
    name: 'Classic Studio',
    description: 'High contrast white on black. Professional broadcast standard.',
    textColorPreset: 'white',
    backgroundStyle: 'black',
    bgOpacity: 100,
    fontSize: 48,
  },
  {
    id: 'theme-youtube',
    name: 'Vibrant YouTube',
    description: 'Bright cyber yellow text on transparent backing.',
    textColorPreset: 'yellow',
    backgroundStyle: 'transparent',
    bgOpacity: 0,
    fontSize: 44,
  },
  {
    id: 'theme-podcast',
    name: 'Green Podcast Room',
    description: 'Relaxing bright neon-green text on deep matte dark gray.',
    textColorPreset: 'green',
    backgroundStyle: 'dark-gray',
    bgOpacity: 90,
    fontSize: 52,
  },
  {
    id: 'theme-business',
    name: 'Executive Glass',
    description: 'Classic crisp white text overlaid on frosted glass.',
    textColorPreset: 'white',
    backgroundStyle: 'glassmorphism',
    bgOpacity: 65,
    fontSize: 40,
  },
  {
    id: 'theme-cosmic',
    name: 'Cosmic Twilight',
    description: 'Stunning purple colors on radial deep cosmic dark backdrop.',
    textColorPreset: 'cyan',
    backgroundStyle: 'gradient-cosmic',
    bgOpacity: 85,
    fontSize: 46,
  }
];
