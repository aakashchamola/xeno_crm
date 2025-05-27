# AI Service

This service exposes an endpoint to convert natural language audience descriptions into structured segment rules using an open-source LLM.

## Endpoints

- `POST /ai/parse-rules`  
  Body: `{ "prompt": "People who haven't shopped in 6 months and spent over ₹5K" }`  
  Response: `{ "rules": [ ... ], "original": "..." }`

## Example Usage

`POST /ai/parse-rules`

`Request:
{
  "prompt": "People who haven’t shopped in 6 months and spent over ₹5K"
}

Response:
{
  "rules": [
    { "field": "last_purchase_date", "op": "<", "value": "2023-12-01" },
    { "field": "spend", "op": ">", "value": 5000 }
  ],
  "original": "People who haven’t shopped in 6 months and spent over ₹5K"
}`

## Running

```bash
docker-compose up --build
```