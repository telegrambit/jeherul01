
export interface Prompt {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  tags: string[];
  createdAt: number;
  recipe?: RecipeStep[];
  format?: 'square' | 'thumbnail'; // New field: Default is 'square'
}

export interface RecipeStep {
  id: string;
  type: 'image';
  label: string; 
  imageUrl?: string; 
}

export interface Category {
  id: string;
  name: string;
  icon?: string; 
}

export interface ContactMessage {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

export interface AppState {
  prompts: Prompt[];
  categories: Category[];
  messages: ContactMessage[];
  analytics: number[]; 
  wishlist: string[]; 
  adminUsername?: string;
  adminPassword?: string;
  adminPin?: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: 'All Prompts', icon: 'LayoutGrid' },
  { id: 'thumbnail', name: 'Thumbnails', icon: 'Monitor' }, // Added default Thumbnail category
  { id: 'photorealistic', name: 'Photorealistic', icon: 'Camera' },
  { id: 'anime', name: 'Anime & Manga', icon: 'Zap' },
  { id: '3d-render', name: '3D Render', icon: 'Box' },
  { id: 'painting', name: 'Digital Painting', icon: 'Brush' },
  { id: 'concept', name: 'Concept Art', icon: 'PenTool' },
];

export const INITIAL_PROMPTS: Prompt[] = [
  {
    id: '1',
    title: 'Neon Cyberpunk City',
    description: 'A futuristic cyberpunk city street at night, raining, neon lights reflecting on wet pavement, towering skyscrapers with holographic advertisements, cinematic lighting, highly detailed, photorealistic, 8k.',
    imageUrl: 'https://picsum.photos/id/230/800/800',
    categoryId: 'photorealistic',
    tags: ['cyberpunk', 'city', 'neon', 'rain', 'night'],
    createdAt: Date.now(),
    format: 'square'
  },
  {
    id: '2',
    title: 'Ethereal Forest Spirit',
    description: 'A glowing spirit deer in a mystical forest, bioluminescent plants, soft mist, magical atmosphere, fantasy art style, intricate details, soft focus background.',
    imageUrl: 'https://picsum.photos/id/324/800/800',
    categoryId: 'painting',
    tags: ['forest', 'fantasy', 'magic', 'animal'],
    createdAt: Date.now(),
    format: 'square'
  },
  {
    id: '3',
    title: 'Abstract Geometric Shapes',
    description: 'Complex 3D geometric shapes floating in a void, colorful gradients, glass texture, ray tracing, studio lighting, abstract art, minimal composition.',
    imageUrl: 'https://picsum.photos/id/20/800/800',
    categoryId: '3d-render',
    tags: ['abstract', '3d', 'geometry', 'colorful'],
    createdAt: Date.now(),
    format: 'square'
  }
];