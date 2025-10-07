const { GoogleGenAI } = require("@google/genai");
const { v4: uuidv4 } = require("uuid");

// ✅ Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // store this in .env
});

// Temporary in-memory storage
let aiSuggestions = [];

// @route   GET /api/ai
// @desc    Get all AI suggestions for logged-in user
// @access  Private
exports.getAISuggestions = async (req, res) => {
  try {
    const userSuggestions = aiSuggestions.filter(
      (suggestion) => suggestion.userId === req.user.id
    );

    res.json({
      success: true,
      count: userSuggestions.length,
      data: userSuggestions,
    });
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch AI suggestions",
    });
  }
};

// @route   POST /api/ai
// @desc    Create new AI suggestion
// @access  Private
exports.createAISuggestion = async (req, res) => {
  try {
    const { prompt, title } = req.body;
    const userLanguage = req.headers["x-lang"] || "en";

    if (!prompt?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "AI service not configured. Please contact administrator.",
      });
    }

    // Add language instruction if needed
    let enhancedPrompt = prompt.trim();
    if (userLanguage === "hi") {
      enhancedPrompt +=
        "\n\nअपना जवाब हिंदी में दें। हिंदी भाषा का उपयोग करते हुए सुझाव प्रदान करें।";
    }

    // ✅ Call Gemini API
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Fast and capable model
      contents: enhancedPrompt,
    });

    // Extract text safely
    const suggestion =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    const aiSuggestion = {
      id: uuidv4(),
      userId: req.user.id,
      title: title || "AI Suggestion",
      prompt,
      suggestion,
      createdAt: new Date().toISOString(),
    };

    aiSuggestions.push(aiSuggestion);

    res.status(201).json({
      success: true,
      data: aiSuggestion,
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI suggestion",
    });
  }
};

// @route   DELETE /api/ai/:id
// @desc    Delete AI suggestion
// @access  Private
exports.deleteAISuggestion = async (req, res) => {
  try {
    const suggestionId = req.params.id;
    const suggestionIndex = aiSuggestions.findIndex((s) => s.id === suggestionId);

    if (suggestionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "AI suggestion not found",
      });
    }

    if (aiSuggestions[suggestionIndex].userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this suggestion",
      });
    }

    aiSuggestions.splice(suggestionIndex, 1);

    res.json({
      success: true,
      message: "AI suggestion deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete AI suggestion",
    });
  }
};
