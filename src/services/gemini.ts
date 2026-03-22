import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Language } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askGemini(prompt: string, systemInstruction?: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
  return response.text;
}

export async function askGeminiMultimodal(prompt: string, imageData: string, mimeType: string, systemInstruction?: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: imageData.split(",")[1],
            mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      systemInstruction,
    },
  });
  return response.text;
}

export async function estimateMaterials(imageData: string, mimeType: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: imageData.split(",")[1],
            mimeType,
          },
        },
        {
          text: "Analyze this civil engineering plan or building image. Estimate the required materials (Cement in bags, Sand in cft, Rod in kg, Bricks in numbers) and total cost in BDT based on current Bangladesh market rates. Return ONLY a JSON object with keys: cement, sand, rod, bricks, totalCost, and a brief 'explanation' in Bengali.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cement: { type: Type.NUMBER },
          sand: { type: Type.NUMBER },
          rod: { type: Type.NUMBER },
          bricks: { type: Type.NUMBER },
          totalCost: { type: Type.NUMBER },
          explanation: { type: Type.STRING },
        },
        required: ["cement", "sand", "rod", "bricks", "totalCost", "explanation"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
}

export async function getDynamicHomeContent(lang: Language) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 4 important civil engineering topics and 3 common Q&A pairs for engineers in Bangladesh. Return ONLY a JSON object with keys: topics (array of {bn, en, key}) and qa (array of {q, a} in ${lang === 'bn' ? 'Bengali' : 'English'}).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                bn: { type: Type.STRING },
                en: { type: Type.STRING },
                key: { type: Type.STRING },
              },
              required: ["bn", "en", "key"],
            },
          },
          qa: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                q: { type: Type.STRING },
                a: { type: Type.STRING },
              },
              required: ["q", "a"],
            },
          },
        },
        required: ["topics", "qa"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
}

export async function getLandSuggestion(area: number, unit: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Land area is ${area} ${unit}. Suggest the maximum building footprint (area) and maximum number of floors allowed according to standard Bangladesh building codes (BNBC). Provide the answer in Bengali.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          footprint: { type: Type.STRING },
          floors: { type: Type.STRING },
          reasoning: { type: Type.STRING },
        },
        required: ["footprint", "floors", "reasoning"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
}

export async function generateExampleImage(prompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `A realistic civil engineering example image of: ${prompt}. Professional, high quality, technical detail.`,
        },
      ],
    },
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
