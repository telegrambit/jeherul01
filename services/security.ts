
// --- Hashing Utility ---
// This converts "admin123" into "240be518..." so it cannot be read in the source code.

export const hashValue = async (val: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(val);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Default Hashes for initial setup
// User: 'admin'
export const DEFAULT_USER_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; 
// Pass: 'admin123'
export const DEFAULT_PASS_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
// Pin: '0000'
export const DEFAULT_PIN_HASH = '9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0';
