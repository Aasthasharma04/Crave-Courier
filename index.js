import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body.messages || [];

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ NEW WORKING MODEL
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ reply: "Server Error: " + error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

