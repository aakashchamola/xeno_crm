# AI Service

The AI Service exposes endpoints to convert natural language audience descriptions into structured segment rules, suggest campaign messages, auto-tag campaigns, and more using open-source LLMs. It powers the AI features in the Xeno CRM system.

---

## Features

- **POST /ai/parse-rules**: Convert natural language to segment rules
- **POST /ai/suggest-message**: Suggest campaign message variants
- **POST /ai/auto-tag**: Auto-tag campaigns by intent
- **POST /ai/lookalike**: Suggest lookalike audience rules
- **POST /ai/performance-summary**: Summarize campaign performance
- **POST /ai/suggest-send-time**: Suggest best send time
- **Health check** endpoint at `/health` (port 8004)

---

## Running the AI Service Individually

### 1. Install dependencies

```bash
cd ai-service
npm install
```

### 2. Create a `.env` file in `ai-service/` with the following variables:

```
PORT=8004
GEMINI_API_KEY=your_google_gemini_api_key   # (for Gemini endpoints)
```

- If you use endpoints that require external APIs (e.g., Gemini), set the relevant API keys.
- No direct DB or RabbitMQ connection is required for this service.

### 3. Start the service

```bash
npm start
```

The AI Service will be available at [http://localhost:8004](http://localhost:8004)

---

## Health Check

- `GET http://localhost:8004/health` returns `{ status: 'ok' }` if the service is running.

---

## Example Usage

### Parse Rules from Natural Language

```bash
curl -X POST http://localhost:8004/ai/parse-rules \
  -H "Content-Type: application/json" \
  -d '{"prompt": "People who haven't shopped in 6 months and spent over ₹5K"}'
```

### Suggest Campaign Messages

```bash
curl -X POST http://localhost:8004/ai/suggest-message \
  -H "Content-Type: application/json" \
  -d '{"segmentRules": {"combinator": "and", "rules": [{"field": "spend", "op": ">", "value": 10000}]}, "campaignName": "Summer Sale"}'
```

### Auto-tag Campaign

```bash
curl -X POST http://localhost:8004/ai/auto-tag \
  -H "Content-Type: application/json" \
  -d '{"campaignName": "Summer Sale", "message": "Hi Mohit, here's 10% off…"}'
```

### Lookalike Audience

```bash
curl -X POST http://localhost:8004/ai/lookalike \
  -H "Content-Type: application/json" \
  -d '{"segmentRules": {"combinator": "and", "rules": [{"field": "spend", "op": ">", "value": 10000}]}}'
```

### Performance Summary

```bash
curl -X POST http://localhost:8004/ai/performance-summary \
  -H "Content-Type: application/json" \
  -d '{"stats": {"sent": 100, "failed": 10, "audienceSize": 110}}'
```

### Suggest Send Time

```bash
curl -X POST http://localhost:8004/ai/suggest-send-time \
  -H "Content-Type: application/json" \
  -d '{"campaignName": "Summer Sale"}'
```

---

## Troubleshooting

- If the service fails to start, ensure all required environment variables are set in `.env`.
- If LLM endpoints fail, check your API keys and network access.
- Use `npm start` in this directory to run the service standalone, or use Docker Compose for the full stack.
- Logs will show inference and API errors.

---