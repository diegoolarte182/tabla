import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// List of supported tool IDs for verification
const SUPPORTED_TOOL_IDS = [
  "canva", "genially", "kahoot", "quizizz", "nearpod", "padlet",
  "google-classroom", "moodle", "trello", "duolingo", "scratch",
  "miro", "notion", "pear-deck", "mentimeter", "socrative",
  "edpuzzle", "wordwall", "flipgrid", "classdojo", "khan-academy",
  "ted", "jamboard"
];

// Lazy-loaded Gemini client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not configured or uses the placeholder value.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// AI suggest route
app.post("/api/ai/suggest", async (req, res) => {
  try {
    const { subjects, purpose, experience, query, history } = req.body;

    const client = getAiClient();
    
    // Offline / fallback response if key is missing or invalid
    if (!client) {
      // Simulate beautiful pedagogical advice using local rules!
      let greeting = "Hello teacher! Here is a curated recommendation from our digital educational database: \n\n";
      let suggestedToolIds: string[] = [];
      let adviceText = "";

      if (query) {
        const queryLower = query.toLowerCase();
        if (queryLower.includes("quiz") || queryLower.includes("assess") || queryLower.includes("test")) {
          adviceText = "- For interactive assessments, **Quizizz** and **Kahoot!** offer wonderful competitive gameplay.\n- If you need deeper data tracking for teenagers, check out **Socrative** or **Mentimeter**.";
          suggestedToolIds = ["quizizz", "kahoot", "socrative", "mentimeter"];
        } else if (queryLower.includes("speak") || queryLower.includes("write") || queryLower.includes("eng")) {
          adviceText = "- Explore **Flip (Flipgrid)** for selfie video recordings to practice spoken phonics.\n- Try **Padlet** or **Notion** as collaborative writing diaries where peers can critique drafts.";
          suggestedToolIds = ["flipgrid", "padlet", "notion"];
        } else if (queryLower.includes("art") || queryLower.includes("design") || queryLower.includes("visual")) {
          adviceText = "- **Canva** is fantastic for building custom presentation slides and learning posters.\n- Try **Genially** for rich interactive maps and digital breakout escape games.";
          suggestedToolIds = ["canva", "genially"];
        } else if (queryLower.includes("math") || queryLower.includes("science") || queryLower.includes("stem")) {
          adviceText = "- Highly recommend **Khan Academy** for mastery-based adaptive math exercises.\n- Try **Scratch** for visual block programming to simulate math gravity curves.";
          suggestedToolIds = ["khan-academy", "scratch"];
        } else {
          adviceText = "- Dive into **Canva** to design engaging slides.\n- Try **Nearpod** to inject real-time student-paced polls.\n- Organize team whiteboard maps on **Miro**.";
          suggestedToolIds = ["canva", "nearpod", "miro"];
        }
      } else {
        // Based on onboarding categories
        const sub = (subjects && subjects.length > 0) ? subjects[0] : "All Subjects";
        adviceText = `For teaching **${sub}**, we recommend starting your classroom with:
- **Canva** for custom beautiful presentations.
- **Nearpod** to synchronize interactive student responses.
- **Padlet** for high-energy collaboration.

Explore the periodic cell cards to earn XP badges!`;
        suggestedToolIds = ["canva", "nearpod", "padlet"];
      }

      const adviceNote = "\n\n*(Note: Running in local diagnostic mode. Connect your GEMINI_API_KEY in AI Studio Secrets to unlock real generative AI responses!)*";

      return res.json({
        text: greeting + adviceText + adviceNote,
        suggestedToolIds: suggestedToolIds.filter(id => SUPPORTED_TOOL_IDS.includes(id))
      });
    }

    // Build the chat or direct prompt
    let chatConversation = "";
    if (history && history.length > 0) {
      chatConversation = history.map((m: any) => `${m.role === "user" ? "Teacher" : "Assistant"}: ${m.text}`).join("\n");
    }

    const currentQuery = query || "Please provide personalized Edtech tools recommendations matches my focus.";

    const systemPrompt = `You are an expert EdTech consultant and pedagogical coach specializing in digital learning environments for K-12, higher education, and language classrooms.
Your job is to recommend educational tools ONLY from the following periodic database:

${SUPPORTED_TOOL_IDS.join(", ")}

Refer to how these tools can assist the teacher with:
- Target subjects: ${subjects ? subjects.join(", ") : "Any"}
- Usage focus: ${purpose ? purpose.join(", ") : "General engagement"}
- Tech experience: ${experience || "Intermediate"}

Respond using Markdown formatting. Be professional, highly encouraging, structured, and give concrete classroom activities (e.g. "Do a gallery walk on Padlet" or "Assign a self-paced quiz on Quizizz").
You must also return the EXACT lowercase IDs of the recommended tools so they can be shown in the UI. Keep suggestedToolIds limited to 4 tools max.`;

    const promptText = `Onboarding Context:
Teacher is teaching: ${subjects ? subjects.join(", ") : "All levels"}.
Needs tools for: ${purpose ? purpose.join(", ") : "Interactive lessons"}.
Tech level: ${experience || "Intermediate"}.

Chat dialogue histories:
${chatConversation}

Current query/request:
${currentQuery}

Return a structured JSON match containing the text reply and recommended tool list.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "Structured markdown pedagogical advice answering the educator's query or profile criteria.",
            },
            suggestedToolIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of lowercase tool IDs recommended in this response matching the database.",
            },
          },
          required: ["text", "suggestedToolIds"],
        },
      },
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    const cleanToolIds = (parsedData.suggestedToolIds || []).filter((id: string) => SUPPORTED_TOOL_IDS.includes(id.toLowerCase()));

    return res.json({
      text: parsedData.text || "I recommend viewing our periodic table map to explore Canva or Nearpod for your classes!",
      suggestedToolIds: cleanToolIds,
    });

  } catch (error: any) {
    console.error("Gemini server error:", error);
    return res.status(500).json({
      error: "Failed to communicate with AI Consultant",
      details: error.message,
    });
  }
});

// Configure Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production build from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
