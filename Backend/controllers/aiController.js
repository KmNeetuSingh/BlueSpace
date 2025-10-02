const supabase = require('../config/supabase');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.getAISuggestions = async (req, res) => {
  const { data, error } = await supabase
    .from('ai_suggestions')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.createAISuggestion = async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal) return res.status(400).json({ error: 'Goal is required' });

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI assistant that provides actionable steps to achieve a goal." },
        { role: "user", content: `Suggest 5 actionable steps for the goal: "${goal}"` }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const suggestionsText = aiResponse.choices[0].message.content.trim();
    const suggestionsArray = suggestionsText.split('\n').map(s => s.replace(/^\d+\. /, '').trim()).filter(Boolean);

    const { data, error } = await supabase
      .from('ai_suggestions')
      .insert({
        user_id: req.user.id,
        goal,
        suggestions: suggestionsArray
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI generation failed' });
  }
};

exports.deleteAISuggestion = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('ai_suggestions')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
};
