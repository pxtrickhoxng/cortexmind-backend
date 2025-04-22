/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import aiRouter from "./routes/aiRoutes.ts";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/submit", (req, res) => {
  const { content } = req.body;
  console.log(content);
  res.json({ content: content });
});

app.use("/api/ai/generate", aiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port: http://localhost:${process.env.PORT}`);
});
