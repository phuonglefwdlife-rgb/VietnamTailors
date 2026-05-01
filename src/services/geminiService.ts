import { GoogleGenAI } from "@google/genai";
import { BodyMeasurements } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeInspirationImage(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: "Analyze this clothing item. Identify the style, potential materials, and key design features (collar type, button style, silhouette). Provide a brief summary." },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] || base64Image,
              },
            },
          ],
        },
      ],
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    return "Could not analyze image at this time.";
  }
}

export async function getStyleRecommendations(measurements: BodyMeasurements, preferences: string) {
  const prompt = `
    Based on the following body measurements:
    Height: ${measurements.height}cm
    Weight: ${measurements.weight}kg
    Chest: ${measurements.chest}cm
    Waist: ${measurements.waist}cm
    Hips: ${measurements.hips}cm
    Shoulders: ${measurements.shoulders}cm
    Arm Length: ${measurements.armLength}cm
    Inseam: ${measurements.inseam}cm

    User Preferences: ${preferences}

    Suggest 3 distinct clothing styles that would complement this physique. 
    Focus on silhouette (e.g., slim fit vs structured), fabric weight, and specific tailoring details.
    Be encouraging and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Style Recommendation Error:", error);
    return "Failed to generate recommendations.";
  }
}
