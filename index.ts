import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import useAi from "./openai";
import { saveConvoType, submitType } from "./types";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/submit", async (req: Request, res: Response) => {
  const { text, selectedOption }: submitType = req.body;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
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
