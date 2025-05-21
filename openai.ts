import OpenAI from "openai";
import "dotenv/config";
import { Response } from "express";
import { neon } from "@neondatabase/serverless";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.SECRET_KEY,
});

const sql = neon(process.env.DATABASE_URL!);
const aiRole = "Role.Assistant";

enum Role {
  User = "user",
  System = "system",
  Assistant = "assistant",
}

let messageHistory = [
  {
    role: Role.System,
    content: `You are an assistant that responds using proper markdown formatting **when appropriate**.
              Use bullet points, bold/italic text, and headings for clarity. 
              Use code blocks only when the user asks for code or when code examples are relevant.
              Avoid formatting general facts or non-code answers inside code blocks.`,
  },
];

export const resetMessageHistory = () => {
  messageHistory.length = 1;
};

const useAi = async (
  userInput: string[],
  aiOutput: string[],
  res: Response,
  selectedOption: string,
  appendHistory: boolean = false,
  uuid: string,
  userId: string
) => {
  let temperature: number;

  switch (selectedOption) {
    case "General":
      temperature = 1.3;
      break;
    case "Creative":
      temperature = 1.5;
      break;
    case "Math":
      temperature = 0.0;
      break;
    case "Coding":
      temperature = 0.0;
      break;
    case "Analysis":
      temperature = 1.0;
      break;
    default:
      temperature = 1.3;
  }

  const messages = [...messageHistory];

  messages.push({ role: Role.User, content: userInput[userInput.length - 1] });

  if (appendHistory) {
    messages.push({ role: Role.Assistant, content: aiOutput[aiOutput.length - 1] });

    messageHistory = [...messages];

    return;
  }

  try {
    const stream = await openai.chat.completions.create({
      messages,
      model: "deepseek-chat",
      stream: true,
      temperature,
      max_tokens: 500,
    });

    let fullResponse = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
      res.write(content);
    }

    messages.push({ role: Role.Assistant, content: fullResponse });

    try {
      await sql`
        INSERT INTO public.user_chat_history (content, role, timestamp, user_id, chat_id)
        VALUES (${fullResponse}, ${aiRole}, CURRENT_TIMESTAMP, ${userId}, ${uuid} )
      `;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to insert into database" });
    }

    messageHistory = [...messages];
  } catch (error) {
    console.error("Error interacting with AI:", error);
    res.status(500).json({ error: "Failed to process AI response" });
  } finally {
    res.end();
  }
};

export default useAi;
