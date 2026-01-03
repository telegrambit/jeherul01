export interface ModFeature {
  name: string;
  isPro: boolean;
}

export interface AppData {
  id: string;
  name: string;
  category: string;
  version: string;
  size: string;
  downloads: string;
  icon: string;
  rating: number;
  description: string;
  modFeatures: ModFeature[];
  images: string[];
}

export type Tab = 'home' | 'search' | 'categories' | 'profile';
