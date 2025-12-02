import { GoogleGenAI } from "@google/genai";
import type { ThreatLog, AIAnalysisResult } from '../types';

const apiKey = import.meta.env.VITE_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeThreatWithGemini = async (threat: ThreatLog): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    return {
      threatId: threat.id,
      analysis: "API Key not configured. Unable to perform AI analysis.",
      remediationSteps: ["Configure API Key in metadata"],
      riskScore: 0
    };
  }

  try {
    const prompt = `
      You are a top-tier cybersecurity analyst. Analyze the following threat log entry:
      
      JSON Data:
      ${JSON.stringify(threat)}

      Please provide:
      1. A concise analysis of what this attack likely represents.
      2. A calculated risk score from 1-100 based on the severity and type.
      3. Three specific, actionable remediation steps for a SOC analyst.
      
      Return ONLY valid JSON in this format:
      {
        "analysis": "string",
        "riskScore": number,
        "remediationSteps": ["step1", "step2", "step3"]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const result = JSON.parse(text);

    return {
      threatId: threat.id,
      analysis: result.analysis,
      remediationSteps: result.remediationSteps,
      riskScore: result.riskScore
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      threatId: threat.id,
      analysis: "Failed to analyze threat due to API error.",
      remediationSteps: ["Check system logs", "Verify API connectivity"],
      riskScore: 0
    };
  }
};
