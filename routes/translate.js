const express = require('express');
const router = express.Router();
const translate = require('@vitalets/google-translate-api');

router.post('/', async (req, res) => {
  const { text, to, from } = req.body;
  if (!text || !to) {
    return res.status(400).json({ error: '"text" and "to" fields are required' });
  }

  try {
    const result = await translate(text, { to, from: from || 'auto' });
    res.json({
      text: result.text,
      from: result.from.language.iso,
      pronunciation: result.pronunciation,
      raw: result.raw
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Translation failed' });
  }
});

module.exports = router;