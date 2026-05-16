const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const axios = require('axios');

// Using a generic free HuggingFace model or OpenAI/Gemini depending on environment config
const AI_API_URL = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
const AI_API_KEY = process.env.AI_API_KEY;

// @desc    Chat with AI Tutor
// @route   POST /api/ai/chat
// @access  Enrolled Student
const chatWithTutor = asyncHandler(async (req, res) => {
  const { message, context } = req.body;
  if (!message) throw new ApiError(400, 'Message is required');

  if (!AI_API_KEY) {
    // Development fallback
    return res.status(200).json(new ApiResponse(200, 'AI response simulated (No API Key)', {
      reply: `This is a simulated response. You asked: "${message}". In a production environment with a valid API key, an AI model would analyze your question and the current lesson context to provide a helpful answer.`
    }));
  }

  try {
    const prompt = `You are a helpful Data Science tutor for the SkillForge platform.
Context of the current lesson/lab the student is working on:
${context || 'No specific context provided.'}

Student's question: ${message}
Please provide a clear, concise, and educational response. Do not just give the final code answer; guide them to it.`;

    const response = await axios.post(AI_API_URL, {
      model: "gpt-3.5-turbo", // default fallback, change via env
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0].message.content;
    
    return res.status(200).json(new ApiResponse(200, 'AI response generated', { reply }));

  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    throw new ApiError(500, 'Failed to communicate with AI Tutor service');
  }
});

module.exports = {
  chatWithTutor
};