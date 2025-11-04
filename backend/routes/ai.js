const express = require("express");
const axios = require("axios");
const router = express.Router();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

router.post("/subtasks", async (req, res) => {
  const { title } = req.body;
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "user",
            content: `Break the following task into 4–6 actionable subtasks:
            "${title}"
            Return them strictly as a JSON array like ["subtask1", "subtask2", "subtask3", ...].`
          }
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content;
    let subtasks;
    try {
      subtasks = JSON.parse(text);
    } catch {
      subtasks = text.split(/\n|,/).map(s => s.trim()).filter(Boolean);
    }

    res.json({ subtasks });
  } catch (error) {
    console.error("AI error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI generation failed" });
  }
});

module.exports = router;
