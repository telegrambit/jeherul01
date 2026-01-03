import { AppData } from './types';

export const MOCK_APPS: AppData[] = [
  {
    id: '1',
    name: 'Spotify Premium',
    category: 'Music',
    version: '8.9.12',
    size: '45 MB',
    downloads: '10M+',
    rating: 4.8,
    icon: 'https://picsum.photos/id/1/200/200', // Placeholder
    description: 'Unlock the ultimate music experience! 🎵 This Premium Mod gives you ad-free listening, unlimited skips, and high-quality audio streaming. Download offline playlists and enjoy your favorite tunes without any interruptions. 🚀',
    modFeatures: [
      { name: 'No Ads', isPro: true },
      { name: 'Unlimited Skips', isPro: true },
      { name: 'High Quality Audio', isPro: true }
    ],
    images: ['https://picsum.photos/id/10/600/300', 'https://picsum.photos/id/11/600/300']
  },
  {
    id: '2',
    name: 'Minecraft Pocket',
    category: 'Games',
    version: '1.20.50',
    size: '120 MB',
    downloads: '50M+',
    rating: 4.9,
    icon: 'https://picsum.photos/id/2/200/200',
    description: 'Build, craft, and explore! 🧱 This mod unlocks all skins and textures, plus gives you God Mode for survival. Create your own world without limits and dominate the game with exclusive features enabled by default. ⚔️',
    modFeatures: [
      { name: 'God Mode', isPro: true },
      { name: 'All Skins Unlocked', isPro: true },
      { name: 'One Hit Kill', isPro: true }
    ],
    images: ['https://picsum.photos/id/14/600/300', 'https://picsum.photos/id/15/600/300']
  },
  {
    id: '3',
    name: 'Netflix Mod',
    category: 'Entertainment',
    version: '9.0.0',
    size: '30 MB',
    downloads: '5M+',
    rating: 4.5,
    icon: 'https://picsum.photos/id/3/200/200',
    description: 'Watch your favorite movies and series in 4K UHD! 🍿 No subscription needed, no login required. Access global content libraries including US/UK exclusives directly on your device. Binge-watching made free and easy! 🎬',
    modFeatures: [
      { name: '4K Support', isPro: true },
      { name: 'No Login Required', isPro: true },
      { name: 'Global Content', isPro: false }
    ],
    images: ['https://picsum.photos/id/20/600/300', 'https://picsum.photos/id/21/600/300']
  },
  {
    id: '4',
    name: 'Clash of Clans',
    category: 'Games',
    version: '15.0.1',
    size: '200 MB',
    downloads: '100M+',
    rating: 4.7,
    icon: 'https://picsum.photos/id/4/200/200',
    description: 'Dominate the battlefield with unlimited resources! 💎 Build the ultimate village instantly with unlimited Gems, Gold, and Elixir. Play on a high-speed private server with custom mods and zero waiting times. 🏰',
    modFeatures: [
      { name: 'Unlimited Gems', isPro: true },
      { name: 'Unlimited Gold', isPro: true },
      { name: 'Private Server', isPro: true }
    ],
    images: ['https://picsum.photos/id/25/600/300', 'https://picsum.photos/id/26/600/300']
  },
  {
    id: '5',
    name: 'PicsArt Gold',
    category: 'Photography',
    version: '21.0.4',
    size: '70 MB',
    downloads: '8M+',
    rating: 4.6,
    icon: 'https://picsum.photos/id/5/200/200',
    description: 'Edit like a pro! 🎨 All Gold features are unlocked: exclusive filters, fonts, and stickers. Remove objects, change backgrounds, and export in high resolution without any annoying watermarks. 📸',
    modFeatures: [
      { name: 'Gold Features Unlocked', isPro: true },
      { name: 'No Watermark', isPro: true }
    ],
    images: ['https://picsum.photos/id/30/600/300', 'https://picsum.photos/id/31/600/300']
  },
  {
    id: '6',
    name: 'Subway Surfers',
    category: 'Games',
    version: '3.12.0',
    size: '90 MB',
    downloads: '1B+',
    rating: 4.5,
    icon: 'https://picsum.photos/id/6/200/200',
    description: 'Run forever! 🏃‍♂️ Unlimited Coins and Keys let you buy every board and upgrade instantly. All characters are unlocked from the start. Set new high scores with infinite hoverboards! 🛹',
    modFeatures: [
      { name: 'Unlimited Keys', isPro: true },
      { name: 'Unlimited Coins', isPro: true },
      { name: 'All Characters', isPro: true }
    ],
    images: ['https://picsum.photos/id/35/600/300', 'https://picsum.photos/id/36/600/300']
  }
];

export const CATEGORIES = ['All', 'Games', 'Music', 'Entertainment', 'Photography', 'Tools'];