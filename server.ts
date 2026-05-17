import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { nlToSql, getInsights, chatWithData, pythonAnalysis } from "./src/services/gemini";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      geminiKeySet: !!process.env.GEMINI_API_KEY,
      nodeEnv: process.env.NODE_ENV
    });
  });

  // API routes
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history, dataSummary } = req.body;
      const response = await chatWithData(message, history || [], dataSummary || "");
      res.json({ response });
    } catch (error: any) {
      console.error("Server API Error (chat):", error);
      res.status(500).json({ error: error.message || "Chat failed" });
    }
  });

  app.post("/api/gemini/nl-to-sql", async (req, res) => {
    try {
      const { prompt, schema } = req.body;
      if (!prompt || !schema) {
        return res.status(400).json({ error: "Prompt and schema are required" });
      }
      const sql = await nlToSql(prompt, schema);
      res.json({ sql });
    } catch (error: any) {
      console.error("Server API Error (nl-to-sql):", error);
      res.status(500).json({ error: error.message || "Failed to generate SQL" });
    }
  });

  app.post("/api/gemini/insights", async (req, res) => {
    try {
      const { dataSummary } = req.body;
      if (!dataSummary) {
        return res.status(400).json({ error: "Data summary is required" });
      }
      const insights = await getInsights(dataSummary);
      res.json({ insights });
    } catch (error: any) {
      console.error("Server API Error (insights):", error);
      res.status(500).json({ error: error.message || "Failed to generate insights" });
    }
  });

  app.post("/api/gemini/python-analysis", async (req, res) => {
    try {
      const { prompt, schema, sampleData } = req.body;
      if (!prompt || !schema) {
        return res.status(400).json({ error: "Prompt and schema are required" });
      }
      const result = await pythonAnalysis(prompt, schema, sampleData || "[]");
      res.json(result);
    } catch (error: any) {
      console.error("Server API Error (python-analysis):", error);
      res.status(500).json({ error: error.message || "Python analysis failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
