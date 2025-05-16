const res = await fetch("https://us-central1-testapp-40923.cloudfunctions.net/gptfree", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ingredients }),
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/get-recipes", async (req, res) => {
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
    res.json({ recipes });
  } catch (error) {
    console.error("GPT 오류:", error);
    res.status(500).json({ error: "GPT 응답 실패" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
