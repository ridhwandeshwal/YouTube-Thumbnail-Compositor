import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { ThumbnailFormData } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    const data = await base64EncodedDataPromise;
    return {
        inlineData: {
            data,
            mimeType: file.type,
        },
    };
};

export const generateThumbnail = async (formData: ThumbnailFormData): Promise<string> => {
    const { textPrompt, category, faceRefs, bgRefs, stylePrefs, brandPrefs, titleText } = formData;
    
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    
    const userPromptText = `
Instruction to model:
Generate one 1280×720 PNG thumbnail based on the system rules.

Variables:
text_prompt: "${textPrompt}"
video_category: "${category}"
style_prefs: "${stylePrefs || 'N/A'}"
brand_prefs: "${brandPrefs || 'N/A'}"
title_text: "${titleText || 'N/A'}"

Images:
face_refs[]: ${faceRefs.length > 0 ? '{Attached}' : 'None'}
bg_refs[]: ${bgRefs.length > 0 ? '{Attached}' : 'None'}

Hard constraints:
- Size: 1280×720, PNG format.
- Keep 64px safe margins for any text/logo area.
- Prioritize facial fidelity if face_refs are provided.
- Ensure high contrast and legibility suitable for small mobile previews.
- Return only the final image.`;

    const faceRefParts = await Promise.all(faceRefs.map(fileToGenerativePart));
    const bgRefParts = await Promise.all(bgRefs.map(fileToGenerativePart));

    const promptParts: Part[] = [
        ...faceRefParts,
        ...bgRefParts,
        { text: userPromptText }
    ];

    // FIX: The `getGenerativeModel` method is deprecated. The call has been updated to use `ai.models.generateContent`
    // directly, with the correct parameters for the model, contents, system instruction, and configuration as per the latest SDK guidelines.
    // The response handling is also updated to work with the new API structure.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: { parts: promptParts },
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        }
    });
    
    if (!response.candidates || response.candidates.length === 0) {
        throw new Error("The model did not return any candidates.");
    }
    
    const imagePart = response.candidates[0].content.parts.find(part => part.inlineData);

    if (!imagePart || !imagePart.inlineData) {
        const textResponse = response.text;
        throw new Error(`API did not return an image. Response: ${textResponse || "No text response."}`);
    }

    // FIX: The returned image's MIME type is now dynamically used from the response, making the function more robust.
    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
};
