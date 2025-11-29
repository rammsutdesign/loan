import { GoogleGenAI, Type } from "@google/genai";
import { AnalyzedDocumentData } from "../types";

// Initialize Gemini Client
// In a real app, ensure this is handled securely.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Model Constants
const MODEL_FLASH = 'gemini-2.5-flash';

export const GeminiService = {
  /**
   * Starts a chat session with a specialized system instruction for loan advice.
   */
  createLoanAdvisorChat: () => {
    return ai.chats.create({
      model: MODEL_FLASH,
      config: {
        systemInstruction: `You are 'Flow', a helpful, professional, and empathetic AI Loan Advisor for LendFlow AI. 
        Your goal is to assist users in understanding loan products (Personal, Mortgage, Auto, Business), 
        calculating potential payments (use approximations), and guiding them through the application process.
        
        - Be concise and clear.
        - Do not provide binding legal or financial advice, always add a disclaimer if asked for specific investment advice.
        - If the user asks about rates, current rates are roughly: Personal (6-12%), Mortgage (6-8%), Auto (5-9%).
        - Use Markdown for formatting.`,
      }
    });
  },

  /**
   * Analyzes a document (e.g., paystub) to extract financial data.
   */
  analyzeDocument: async (base64Image: string, mimeType: string): Promise<AnalyzedDocumentData> => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType
              }
            },
            {
              text: "Analyze this document. If it looks like a paystub or income statement, extract the Employer Name, Gross Pay (for the period), and Net Pay. Return the result as JSON."
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              employerName: { type: Type.STRING, description: "Name of the employer or payer" },
              period: { type: Type.STRING, description: "Pay period dates if available" },
              grossPay: { type: Type.NUMBER, description: "Gross pay amount for the current period" },
              netPay: { type: Type.NUMBER, description: "Net pay amount for the current period" },
              confidence: { type: Type.NUMBER, description: "Confidence score 0-100" }
            }
          }
        }
      });
      
      const jsonText = response.text;
      if (!jsonText) throw new Error("No data returned");
      return JSON.parse(jsonText) as AnalyzedDocumentData;
    } catch (error) {
      console.error("Document analysis failed:", error);
      throw error;
    }
  },

  /**
   * Provides a quick risk assessment/recommendation based on form data.
   */
  assessRisk: async (data: any) => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: `Assess this loan application data for a preliminary pre-qualification decision. 
        Data: ${JSON.stringify(data)}.
        
        Rules of thumb:
        - Debt-to-Income (DTI) ratio above 45% is high risk.
        - Credit score below 600 is high risk.
        - Return a helpful summary and a likelihood of approval (Low, Medium, High).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, enum: ["Pre-Qualified", "Needs Review", "Unlikely"] },
              reasoning: { type: Type.STRING },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Risk assessment failed:", error);
      return { status: "Needs Review", reasoning: "Could not automatically assess.", tips: [] };
    }
  }
};
