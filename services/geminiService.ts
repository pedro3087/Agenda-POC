
import { GoogleGenAI, Type } from "@google/genai";
import type { Agenda } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const agendaSchema = {
  type: Type.OBJECT,
  properties: {
    title: { 
      type: Type.STRING,
      description: "A concise and relevant title for the meeting based on the document's content." 
    },
    stakeholders: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of key individuals, roles, or groups mentioned or implied in the document who should attend the meeting."
    },
    topics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { 
            type: Type.STRING, 
            description: "The main point or question for this specific discussion topic." 
          },
          duration: { 
            type: Type.INTEGER, 
            description: "An estimated time allocation in minutes required to discuss this topic."
          },
          summary: { 
            type: Type.STRING, 
            description: "A brief, one-sentence summary of the discussion points or goals for this topic."
          }
        },
        required: ["title", "duration", "summary"]
      },
      description: "A list of structured topics to be covered in the meeting."
    }
  },
  required: ["title", "stakeholders", "topics"]
};

export const generateAgendaFromDocument = async (documentText: string): Promise<Agenda> => {
  const prompt = `Based on the following document, create a detailed meeting agenda. Identify the key stakeholders, the main topics for discussion, and estimate a duration in minutes for each topic. The overall meeting title should summarize the document's main purpose.

Document content:
---
${documentText}
---

Generate the agenda.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: agendaSchema,
      },
    });

    const jsonText = response.text.trim();
    const agendaData = JSON.parse(jsonText);
    
    // Basic validation to ensure the data structure is as expected
    if (!agendaData.title || !Array.isArray(agendaData.stakeholders) || !Array.isArray(agendaData.topics)) {
        throw new Error("Invalid agenda structure received from API.");
    }
    
    return agendaData as Agenda;
  } catch (error) {
    console.error("Error generating agenda:", error);
    throw new Error("Failed to generate meeting agenda. Please check the document content and try again.");
  }
};
