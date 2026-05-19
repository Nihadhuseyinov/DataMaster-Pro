import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const errorMsg = "GEMINI_API_KEY is missing. Action required: 1. Go to AI Studio. 2. Open Settings (bottom left). 3. Go to Secrets. 4. Add GEMINI_API_KEY with your valid Gemini API Key.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    genAI = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-datamaster',
        }
      }
    });
  }
  return genAI;
}

export async function chatWithData(message: string, history: any[], dataSummary: string) {
  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `
            You are "DataMaster AI", a helpful data analyst assistant. 
            CONTEXT:
            ${dataSummary}
            
            GUIDELINES:
            - Be concise but insightful.
            - If asked for calculations, perform them based on the context.
            - If you don't know something from the data, say so.
            - Use markdown for formatting.
          `}]
        },
        ...history.map(h => ({
          role: h.role,
          parts: [{ text: h.content }]
        })),
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
}

export async function nlToSql(question: string, schema: string) {
  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{
        role: "user",
        parts: [{ text: `
          You are a SQL expert. Map this question to SQL.
          TABLE: 'data'
          SCHEMA: ${schema}
          Return ONLY SQL code. Do not include markdown code blocks.
          QUESTION: ${question}
        `}]
      }]
    });
    return response.text.replace(/```sql|```/g, '').trim();
  } catch (error) {
    console.error("SQL Error:", error);
    throw error;
  }
}

export async function getInsights(dataSummary: string) {
  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{
        role: "user",
        parts: [{ text: `
          Analyze this data summary and provide 3 tactical business insights.
          DATA: ${dataSummary}
        `}]
      }]
    });
    return response.text;
  } catch (error) {
    console.error("Insights Error:", error);
    throw error;
  }
}

export async function pythonAnalysis(question: string, schema: string, sampleData: string) {
  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{
        role: "user",
        parts: [{ text: `
          You are a Senior Python Data Scientist. 
          Task: Write a Python script using pandas and matplotlib/seaborn to answer the user's question.
          The dataset is loaded into a pandas DataFrame named 'df'.
          
          SCHEMA: ${schema}
          SAMPLE DATA (JSON): ${sampleData}
          
          USER QUESTION: ${question}
          
          INSTRUCTIONS:
          1. DATA CLEANING: The data might have formatting errors (e.g., strings in numeric columns, leading/trailing spaces, inconsistent case). Include code to clean numeric columns (e.g., removing '$' or ',' and converting to float) before analysis.
          2. ROBUSTNESS: Use try-except blocks where appropriate to handle potential data types issues.
          3. ANALYSIS: Perform the specific analysis requested by the user.
          4. RETURN: Return your response as a JSON object with:
          {
            "code": "The python code as a string",
            "explanation": "A concise explanation of the analysis, the cleaning steps taken, and expected findings"
          }
          
          IMPORTANT: Return ONLY the JSON object. Do not include markdown blocks.
        `}]
      }]
    });
    
    const text = response.text.replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Python Analysis Error:", error);
    throw error;
  }
}
