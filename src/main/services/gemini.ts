import { GoogleGenerativeAI } from "@google/generative-ai";
import { EXTENSION_MAP } from "../../shared/constants";

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async classifyFiles(fileNames: string[]): Promise<Record<string, string>> {
        const categories = Object.keys(EXTENSION_MAP).filter(cat => cat !== 'Others');

        const prompt = `
      You are a file organization assistant. Categorize the following list of file names into one of these categories: ${categories.join(', ')}.
      If a file doesn't fit into any, use 'Others'.
      Return ONLY a JSON object where keys are file names and values are the categories.
      
      Files to categorize:
      ${fileNames.join('\n')}
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Clean up markdown code blocks if present
            text = text.replace(/```json|```/g, '').trim();

            return JSON.parse(text);
        } catch (error) {
            console.error("Gemini classification failed:", error);
            return {};
        }
    }
}
