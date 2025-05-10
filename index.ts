import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import useAi from "./openai";
import { saveConvoType, submitType } from "./types";
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const app = express();
app.use(cors());
app.use(express.json());

const sql = neon(process.env.DATABASE_URL!);

app.get("/", async (req: Request, res: Response) => {
  const result = await sql`
  SELECT * 
  FROM public.user_chat_history;
  `;
  res.json(result);
});

app.post("/api/submit", async (req: Request, res: Response) => {
  const { text, selectedOption }: submitType = req.body;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encgpoding", "chunked");

  const role = "Role.User";

  try {
    await sql`
    INSERT INTO public.user_chat_history (content, role, timestamp, user_id)
    VALUES (${text}, ${role}, CURRENT_TIMESTAMP, 1 )
    `;
    await useAi([text], [], res, selectedOption, false);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/save-conversation", async (req: Request, res: Response) => {
  const { userInput, aiOutput, selectedOption }: saveConvoType = req.body;

  try {
    await useAi(userInput, aiOutput, res, selectedOption, true);
  } catch (error) {
    console.error("Error saving conversation:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to save conversation" });
    }
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port: http://localhost:${process.env.PORT || 3000}`);
});
