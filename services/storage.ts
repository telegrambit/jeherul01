
import { AppState, Category, Prompt, DEFAULT_CATEGORIES, INITIAL_PROMPTS } from '../types';
import { DEFAULT_USER_HASH, DEFAULT_PASS_HASH, DEFAULT_PIN_HASH } from './security';

const STORAGE_KEY = 'promptverse_data_v1';

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return {
        prompts: INITIAL_PROMPTS,
        categories: DEFAULT_CATEGORIES,
        messages: [],
        analytics: [],
        wishlist: [], // Default empty
        adminUsername: DEFAULT_USER_HASH, // Storing Hash
        adminPassword: DEFAULT_PASS_HASH, // Storing Hash
        adminPin: DEFAULT_PIN_HASH        // Storing Hash
      };
    }
    const parsed = JSON.parse(serialized);
    return {
      prompts: parsed.prompts || INITIAL_PROMPTS,
      categories: parsed.categories || DEFAULT_CATEGORIES,
      messages: parsed.messages || [],
      analytics: parsed.analytics || [],
      wishlist: parsed.wishlist || [],
      // Fallback to default hashes if not present
      adminUsername: parsed.adminUsername || DEFAULT_USER_HASH,
      adminPassword: parsed.adminPassword || DEFAULT_PASS_HASH,
      adminPin: parsed.adminPin || DEFAULT_PIN_HASH
    };
  } catch (e) {
    console.error("Failed to load state", e);
    return {
      prompts: INITIAL_PROMPTS,
      categories: DEFAULT_CATEGORIES,
      messages: [],
      analytics: [],
      wishlist: [],
      adminUsername: DEFAULT_USER_HASH,
      adminPassword: DEFAULT_PASS_HASH,
      adminPin: DEFAULT_PIN_HASH
    };
  }
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

export const exportData = (state: AppState) => {
  const dataStr = JSON.stringify(state, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const exportFileDefaultName = `promptverse-backup-${new Date().toISOString().slice(0,10)}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};
