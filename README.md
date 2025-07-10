# Google Translate REST API

API REST simple autour de [`google-translate-api`](https://github.com/vitalets/google-translate-api).

## Installation

```bash
git clone <ce-repo>
cd <ce-repo>
npm install
```

## Utilisation

### Lancer le serveur

```bash
npm start
# ou pour le développement :
npm run dev
```

Le serveur s'exécute par défaut sur `http://localhost:3000`.

### Endpoint

#### POST /translate

Traduire un texte.

- **Body JSON :**
  - `text` (string, requis) : texte à traduire
  - `to` (string, requis) : langue cible (ex: "en", "fr")
  - `from` (string, optionnel) : langue source (ex: "fr", "auto" par défaut)

**Exemple d'appel :**

```bash
curl -X POST http://localhost:3000/translate \
  -H 'Content-Type: application/json' \
  -d '{"text":"Bonjour tout le monde", "to":"en"}'
```

**Réponse :**
```json
{
  "text": "Hello everyone",
  "from": "fr",
  "raw": "..." // brut de l'API Google
}
```

## License

MIT