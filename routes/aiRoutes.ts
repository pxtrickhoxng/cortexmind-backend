import express from "express";
import useAi from "../openai";

const router = express.Router();

router.post("/", async (_req, res) => {
  const aiResponse = await useAi();
  res.json({ aiResponse: aiResponse });
});

export default router;
