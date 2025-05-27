---
applyTo: '**'
---
Below is a two-part overview. First, a detailed breakdown of every requirement from the Xeno assignment PDF. Second, a status & plan recap showing what we’ve scaffolded so far and our roadmap for implementing each piece—strictly using open-source, free-to-use technologies.
________________


1. What You Need to Implement (per the PDF)
1. Data Ingestion APIs
* Secure, documented REST endpoints to ingest customer and order data.

* Interactive API docs (Swagger UI or Postman collection) to demonstrate usage.

* Brownie points for a pub/sub architecture:

   * API layer only validates requests.

   * A separate consumer service (Kafka, RabbitMQ, or Redis Streams) persists data asynchronously.

2. Campaign Creation UI
      * A web app (React.js or Next.js) where users can:

         * Define audience segments via dynamic rule logic (e.g. spend > ₹10,000 AND visits < 3 OR inactive 90 days).

         * Combine conditions with AND/OR using a visual rule builder.

         * Preview segment size before saving.

         * Upon saving, redirect to a history page listing past campaigns with stats (sent, failed, audience size), most recent first.

            * Bonus: Polished, intuitive UX (drag-and-drop, visual blocks, etc.)

3. Campaign Delivery & Logging
               * On segment save:

                  1. Insert a new record into communication_log.

                  2. Fan-out: send a personalized message (“Hi Mohit, here’s 10% off…”) to each customer via a dummy vendor API.

                  3. Vendor simulates ~90% success, ~10% failure, and calls a Delivery Receipt API on your backend.

                  4. Receipt API updates statuses in communication_log.

                     * Brownie points: Use a consumer-driven, batch-update process so receipts can be handled in bulk even if vendor calls come individually.

4. Authentication
                        * Google OAuth 2.0 for user login.

                        * Only authenticated users can create segments or view campaign history.

5. AI Integration
At least one AI-powered feature. Ideas include:
                           1. Natural-Language → Segment Rules (“People who haven’t shopped in 6 months and spent over ₹5K”).

                           2. AI-Driven Message Suggestions (generate 2–3 copy variants; bonus: pick product images).

                           3. Performance Summaries (“Your campaign reached 1,284 users…”).

                           4. Smart Scheduling (recommend send times based on patterns).

                           5. Lookalike Audiences.

                           6. Auto-tagging campaigns by intent.

You may use any public AI APIs or local open-source models, but must document your choice
________________


Submission Requirements
                              * Public GitHub repo

                              * Deployed app (Render, Vercel, Railway, etc.)

                              * Demo video (≤ 7 min) covering features, approach, trade-offs, AI use

                              * README.md including local setup, architecture diagram, tech/AI summary, assumptions/limitations

                              * Submit by 3 June 2025

________________


2. What’s Done & Our Implementation Plan
A. What We’ve Implemented (Scaffolded Today)
                                 * Monorepo structure (xeno_crm/), with every major component in its own folder.

                                 * Dockerfiles for each service (API Gateway, ingestion consumer, delivery consumer, vendor simulator, auth service, frontend, AI service).

                                 * Placeholder files (index.js, package.json, openapi.yaml, SQL schema, scripts, CI workflow, README, LICENSE).

                                 * Single docker-compose.yml to spin up all services locally.

                                 * All code organized under backend/, frontend/, ai-service/, infra/, db/, scripts/, .github/.

This scaffold lets you import the entire repo into VS Code instantly and begin coding each module.
________________


B. How We’ll Meet Each Requirement
Requirement
	Tech Choice (OSS)
	Implementation Plan
	1. Data Ingestion APIs
	Node.js + Express, Swagger UI, RabbitMQ (or Kafka)
	• Define /customers & /orders POST routes.
• Validate with Joi.
• Publish to RabbitMQ exchange.
• Build ingestion-consumer to read queue and write to MySQL.
	2. Campaign Creation UI
	Next.js, React, React Hook Form, Zustand (state management)
	• Create a dynamic rule-builder component.
• Fetch preview counts via a backend endpoint.
• Store segments in MySQL and update UI.
	3. Delivery & Logging
	Node.js consumer service, MySQL, RabbitMQ
	• On segment save, publish campaign job to queue.
• vendor-simulator subscribes, sends HTTP callbacks.
• delivery-consumer updates communication_log in batches.
	4. Authentication
	passport-google-oauth20 (Express middleware)
	• Add auth-service with Google OAuth flow.
• Protect API routes & frontend pages via JWT cookies.
	5. AI Integration
	Local Hugging Face Transformers (e.g. GPT-J 6B) or llama.cpp
	• For NLP-to-rule: integrate a small open-source LLM via @xenova/transformers.
• Expose /ai/parse-rules endpoint.
• Hook into UI for live suggestions.
	Submission & Docs
	Markdown, Mermaid.js, GitHub Actions, Render/Vercel
	• Write detailed README.md and requirements.md (assignment copy).
• Generate architecture diagram with Mermaid.
• CI pipeline for lint/test/deploy.
	                                    1. 
All services will run in Docker (no paid infra).

                                    2. Database: MySQL Community Edition (open source).

                                    3. Message broker: RabbitMQ or Kafka (both OSS).

                                    4. AI model: a freely available Hugging Face model hosted locally or via the open-source llama.cpp runtime.

                                    5. Frontend: Next.js (MIT-licensed), React ecosystem (all OSS).

                                    6. Auth: Google’s OAuth library is free to integrate (no vendor lock-in).

Every tool and library listed above is either MIT-licensed or otherwise open source and free for commercial use. This ensures zero cost beyond development time.
________________


With the scaffold in place, our next steps over the coming days will be:
                                       1. Wire up the ingestion APIs and consumer.

                                       2. Build the rule-builder UI, connect it to the backend preview endpoint.

                                       3. Implement campaign fan-out and delivery receipt flow.

                                       4. Add Google OAuth to secure the app.

                                       5. Integrate the AI feature using a local open-source LLM.

                                       6. Write documentation, record demo video, and deploy.

Let me know which part you’d like to tackle first, or if you’d like more detail on any step!