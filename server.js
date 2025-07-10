/*
 * Analyse approfondie du projet "google-translate-api" (https://github.com/vitalets/google-translate-api) :
 *
 * 1. Fonctionnement principal :
 *    - Utilise le reverse-engeneering de l'API Web de Google Translate.
 *    - Forge une requête HTTP GET vers l'endpoint public de Google Translate,
 *      avec les paramètres de texte, langue source et langue cible, ainsi que les tokens de sécurité.
 *    - Parse la réponse JSON pour en extraire la traduction, la translittération et les suggestions.
 *    - Gère automatiquement le rafraîchissement du token d'authentification.
 *
 * 2. Points clés à prendre en compte :
 *    - Ne repose pas sur une clé API officielle : la stabilité peut varier si Google modifie son endpoint.
 *    - Le module expose une fonction `translate(text, options)` retournant une Promise.
 *    - Supporte détection automatique de la langue source (`{ from: 'auto' }`).
 *    - Retourne un objet riche : { text, from: { language: { didYouMean, iso }, text: { didYouMean } } }.
 *
 * 3. Limitations et recommandations :
 *    - Utilisation raisonnable : éviter les appels intensifs pour ne pas être bloqué.
 *    - En cas de plantage, implémenter une stratégie de retry/backoff.
 *
 * Wrapper Express.js exposant une API Web simple :
 *    - GET /translate?text=...&to=...&from=...
 *    - POST /translate  { text, to, from }
 */

const express = require('express');
const { translate } = require('@vitalets/google-translate-api');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Endpoint GET
// Ex: GET  /translate?text=Hello%20world&to=fr&from=en
app.get('/translate', async (req, res) => {
  try {
    const { text, to = 'en', from = 'auto' } = req.query;
    if (!text) {
      return res.status(400).json({ error: 'Le paramètre `text` est requis.' });
    }
    const result = await translate(text, { from, to });
    res.json({
      text: result.text,
      from: result.from,
      raw: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint POST
// Ex: POST /translate
// Body JSON: { text: "Bonjour", to: "en", from: "fr" }
app.post('/translate', async (req, res) => {
  try {
    const { text, to = 'en', from = 'auto' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Le champ `text` est requis dans le corps de la requête.' });
    }
    const result = await translate(text, { from, to });
    res.json({
      text: result.text,
      from: result.from,
      raw: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`API de traduction démarrée sur http://localhost:${port}`);
});
