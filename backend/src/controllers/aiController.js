const OpenAI = require('openai');

const Product = require('../models/Product');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Process Chatbot message with Catalog Context
// @route   POST /api/ai/chat
// @access  Public
const chatWithAI = async (req, res) => {
  const { message, conversationHistory } = req.body;

  try {
    // RAG-lite: Fetch a summary of available catalog products
    const products = await Product.find({}).select('name category price countInStock').limit(10);
    const catalogContext = products.map(p => `- ${p.name} (${p.category}): Rs.${p.price} | Stock: ${p.countInStock}`).join('\n');

    const messages = [
      { 
        role: 'system', 
        content: `You are Sai Elite AI, an expert industrial assistant for Sai Elite India. 
                  You resolve queries about Robotics and AI machinery.
                  You must be incredibly professional.
                  Here is our active product catalog for your reference:\n\n${catalogContext}` 
      },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    res.json({ role: 'system', content: response.choices[0].message.content });
  } catch (error) {
    console.error('AI Error:', error);
    // Graceful fallback for local development if API key is missing
    if (!process.env.OPENAI_API_KEY) {
      return res.json({ role: 'system', content: '[DEV MODE] Hello! Since the OpenAI API Key is missing locally, I am a fallback response. Our catalog looks great though!' });
    }
    res.status(500).json({ message: 'Error communicating with AI service' });
  }
};

module.exports = {
  chatWithAI,
};
