# Xeno CRM Assignment – Requirements Mapping

This document maps the official Xeno SDE Internship Assignment requirements to the implementation in this project.

---

## 1. Data Ingestion APIs

**Requirement:**  
- Secure, well-documented REST APIs for customers and orders.
- Pub-sub architecture: API only validates, persistence is async via consumer.

**Implementation:**  
- API Gateway exposes `/customers` and `/orders` (secure, validated, documented in Swagger).
- Data is published to RabbitMQ and persisted by ingestion-consumer.
- All writes are asynchronous and robust.

---

## 2. Campaign Creation UI

**Requirement:**  
- Web app to define audience segments with flexible rule logic (AND/OR, dynamic rule builder).
- Preview audience size before saving.
- After saving, redirect to campaign history with stats.
- Bonus: Clean, intuitive UX (drag-and-drop, visual rule blocks, etc.).

**Implementation:**  
- Campaign creation UI with rule builder (AND/OR, dynamic, visual).
- Audience preview button shows matching customer count before saving.
- Campaign history page with stats, most recent at top.
- Modern, accessible, and visually appealing UI.

---

## 3. Campaign Delivery & Logging

**Requirement:**  
- On saving a segment, initiate campaign, store in communication_log, send personalized message to each customer via dummy vendor API.
- Vendor API simulates ~90% sent, ~10% failed, and posts delivery receipts.
- Delivery Receipt API updates communication log (bonus: batch updates).

**Implementation:**  
- Campaigns are fanned out, vendor simulator simulates delivery, receipts update logs.
- Delivery stats are shown in campaign history.
- Robust error handling and batch processing in consumers.

---

## 4. Authentication

**Requirement:**  
- Google OAuth 2.0, only logged-in users can create/view campaigns.

**Implementation:**  
- Google OAuth via Auth Service.
- JWT protection on all relevant endpoints.
- Frontend enforces auth for all protected pages.

---

## 5. AI Integration

**Requirement:**  
- At least one AI-powered feature (e.g., NL to rules, message suggestions, campaign summary, lookalike, auto-tag, etc.).

**Implementation:**  
- AI service with multiple endpoints.
- Natural language to segment rules (enabled in UI).
- AI message suggestions (enabled in UI).
- Other AI features (lookalike, auto-tag, performance summary, send-time) implemented in backend, code present in frontend (commented for future upgrades).

---

## 6. UX & UI

**Requirement:**  
- Clean, intuitive, modern, accessible, responsive.

**Implementation:**  
- Modern, accessible, responsive UI.
- Navigation decluttered, context actions in right place.
- Consistent styling, error handling, and feedback.

---

## 7. Documentation & Deployment

**Requirement:**  
- Public GitHub repo, deployed project, demo video, README with setup, architecture, AI tools, known limitations.

**Implementation:**  
- All backend and frontend READMEs are clear and complete.
- Docker Compose for full stack.
- (You must record a demo video and deploy the project for submission.)

---

## 8. Known Limitations / Edge Cases

- If a customer or order is deleted, stats are not automatically recalculated (not required by assignment, but mention in README).
- Batch import/export is not supported out of the box.
- Only two AI features are enabled in the UI by default; others are present in code for future upgrades.

---

## 9. Service Documentation

- Each service has its own README for detailed usage, environment variables, and troubleshooting.
- See the main [`README.md`](README.md) for project structure and orchestration.

---