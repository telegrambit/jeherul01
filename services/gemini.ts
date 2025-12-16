import { GoogleGenAI } from "@google/genai";

export const enhancePromptWithGemini = async (baseIdea: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please configure it in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are an expert AI Art Director. Your goal is to take simple user ideas and expand them into highly detailed, professional image generation prompts suitable for models like Midjourney v6 or Stable Diffusion XL. 
  Focus on:
  1. Lighting (e.g., volumetric, cinematic, studio).
  2. Style (e.g., cyberpunk, oil painting, unreal engine 5 render).
  3. Camera details (e.g., 85mm lens, f/1.8, bokeh).
  4. Composition.
  
  Return ONLY the prompt text. No "Here is the prompt" prefixes. Keep it under 150 words.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Enhance this idea into a full image prompt: "${baseIdea}"`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || baseIdea;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};