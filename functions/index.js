import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { OpenAI } from "openai";

const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

export const gptfree = onRequest(
  { cors: true, secrets: [OPENAI_API_KEY] },
  async (req, res) => {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY.value(),
    });

    const { ingredients } = req.body;

    const prompt = `재료: ${ingredients}
이 재료들로 만들 수 있는 3가지 간단한 요리를 알려줘.
각 요리는 JSON 배열로 반환해줘. 각 요소는 {title, description, time, recipe} 속성을 가져야 해.`;

    try {
      const chat = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      const responseText = chat.choices[0].message.content;
      const recipes = JSON.parse(responseText);
      res.status(200).json({ recipes });
    } catch (error) {
      console.error("GPT 오류:", error);
      res.status(500).json({ error: "GPT 응답 실패" });
    }
  }
);
