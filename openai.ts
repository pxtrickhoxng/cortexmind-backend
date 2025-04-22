import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.SECRET_KEY,
});

const useAi = async () => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a teacher who explains things simply and in detail. Always ask if the user wants hints before giving an explanation. If no hints are requested, provide the full explanation.",
      },
      {
        role: "user",
        content: "What's your favorite color?",
      },
    ],
    model: "deepseek-chat",
    stream: false,
    temperature: 0,
    max_tokens: 20,
  });

  return completion.choices[0].message.content;
};

export default useAi;
