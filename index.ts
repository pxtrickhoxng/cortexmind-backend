import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import useAi from "./openai";
import { saveConvoType, submitType } from "./types";
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { v4 as uuidv4 } from "uuid";
import { resetMessageHistory } from "./openai";

const app = express();

app.use(cors());
app.use(express.json());

const sql = neon(process.env.DATABASE_URL!);

let uuid = uuidv4();

app.post("/api/submit", async (req: Request, res: Response) => {
  const { text, selectedOption, userId }: submitType = req.body;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  const role = "Role.User";

  try {
    await sql`
    INSERT INTO public.user_chat_history (content, role, timestamp, user_id, chat_id)
    VALUES (${text}, ${role}, CURRENT_TIMESTAMP, ${userId}, ${uuid} )
    `;
    await useAi([text], [], res, selectedOption, false, uuid, userId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/save-conversation", async (req: Request, res: Response) => {
  const { userInput, aiOutput, selectedOption, userId }: saveConvoType = req.body;

  try {
    await useAi(userInput, aiOutput, res, selectedOption, true, uuid, userId);
  } catch (error) {
    console.error("Error saving conversation:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to save conversation" });
    }
  }
});

app.post("/api/most-recent-conversation", async (req: Request, res: Response) => {
  const { userId }: { userId: string } = req.body;
  try {
    const mostRecentMessages = await sql`
  SELECT * FROM (
    SELECT DISTINCT ON (chat_id) *
    FROM user_chat_history
    WHERE user_id = ${userId}
    ORDER BY chat_id, timestamp DESC
  ) AS latest_per_chat
  ORDER BY timestamp DESC;
`;

    const messageContents = mostRecentMessages.map(msg => msg.content);
    res.json(messageContents);
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/new-chat", (req: Request, res: Response) => {
  uuid = uuidv4();
  resetMessageHistory();
  res.end();
});

app.post("/api/get-chat", async (req: Request, res: Response) => {
  const { msg }: { msg: string } = req.body;
  try {
    const getChat = await sql`
    SELECT *
    FROM public.user_chat_history
    WHERE chat_id IN (
      SELECT chat_id
      FROM public.user_chat_history
      WHERE content LIKE ${msg + "%"}
    );
  `;
    res.json(getChat);
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/delete-chat", async (req: Request, res: Response) => {
  const { selectedChat }: { selectedChat: string } = req.body;
  try {
    await sql`
      DELETE
      FROM public.user_chat_history
      WHERE chat_id IN (
        SELECT chat_id
        FROM public.user_chat_history
        WHERE content LIKE ${selectedChat + "%"}
    );
    `;
    res.end();
  } catch (error) {
    console.error(error);
  }
  res.end();
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port: http://localhost:${process.env.PORT || 3000}`);
});
