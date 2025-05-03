import OpenAI from "openai";
import "dotenv/config";
import { Response } from "express";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.SECRET_KEY,
});

enum Role {
  User = "user",
  System = "system",
  Assistant = "assistant",
}

let messageHistory = [
  {
    role: Role.System,
    content: "Respond using markdown formatting.",
  },
];

const useAi = async (
  userInput: string[],
  aiOutput: string[] = [],
  res: Response,
  selectedOption: string,
  appendHistory: boolean = false
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

  if (appendHistory) {
    if (aiOutput[aiOutput.length - 1]) {
      messages.push({ role: Role.Assistant, content: aiOutput[aiOutput.length - 1] });
    }
  } else {
    messages.push({ role: Role.User, content: userInput[userInput.length - 1] });
  }

  console.log(messages);

  try {
    const stream = await openai.chat.completions.create({
      messages,
      model: "deepseek-chat",
      stream: true,
      temperature: temperature,
      max_tokens: 100,
    });

    for await (const chunk of stream) {
      res.write(chunk.choices[0]?.delta?.content || "");
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
