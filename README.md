# Readme

---

## 🛠️ How to Run the Project (Local Dev)

### **1. Prerequisites**
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- (Optional for local dev) Node.js 18+/npm if running services individually

### **2. Clone the Repository**
```bash
git clone <your-repo-url>
cd xeno_crm
```

### **3. Configure the Root .env File**

Create a `.env` file in the project root with the following variables (example values shown; replace secrets with your own):

```env
# API Gateway
PORT=8002
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=xeno_crm
RABBITMQ_URL=amqp://localhost
JWT_SECRET=changeme_jwt_secret

# Ingestion Consumer
# (uses MYSQL_* and RABBITMQ_URL above)

# Delivery Consumer
VENDOR_API_URL=http://localhost:8005/send

# Vendor Simulator
API_GATEWAY_URL=http://localhost:8002/delivery-receipts

# Auth Service
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8003/auth/google/callback
FRONTEND_URL=http://localhost:8001

# AI Service
GEMINI_API_KEY=your_gemini_api_key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8002
NEXT_PUBLIC_AI_URL=http://localhost:8004
NEXT_PUBLIC_GOOGLEAUTH_URL=http://localhost:8003
```

**Note:**
- Use your real Google/Gemini credentials for local development, but never commit them to version control.
- The values above are placeholders and will not work for production.

### **4. Start All Services with Docker Compose**
```bash
docker-compose up --build
```
- This will build and start all backend, AI, and frontend services, plus MySQL and RabbitMQ.
- Access the app at [http://localhost:8001]

### **5. Service Ports & URLs**
| Service            | Port   | URL/Docs                        |
|--------------------|--------|---------------------------------|
| Frontend (Next.js) | 8001   | http://localhost:8001           |
| API Gateway        | 8002   | http://localhost:8002           |
|   └ Swagger UI     |        | http://localhost:8002/api-docs  |
| Auth Service       | 8003   | http://localhost:8003           |
| AI Service         | 8004   | http://localhost:8004           |
| Vendor Simulator   | 8005   | http://localhost:8005           |
| Ingestion Consumer | 8007   | http://localhost:8007/health    |
| Delivery Consumer  | 8008   | http://localhost:8008/health    |
| RabbitMQ UI        | 15672  | http://localhost:15672          |
| MySQL              | 3306   | (internal)                      |

---

## 🧩 Service Details

Each service has its own README with:
- What the service does
- How to run it standalone (npm/Docker)
- Required environment variables
- Health check endpoints
- Troubleshooting tips

**See:**
- [`backend/api-gateway/README.md`](backend/api-gateway/README.md)
- [`backend/ingestion-consumer/README.md`](backend/ingestion-consumer/README.md)
- [`backend/delivery-consumer/README.md`](backend/delivery-consumer/README.md)
- [`backend/vendor-simulator/README.md`](backend/vendor-simulator/README.md)
- [`backend/auth-service/README.md`](backend/auth-service/README.md)
- [`ai-service/README.md`](ai-service/README.md)
- [`frontend/README.md`](frontend/README.md)

---

## 🏗️ Key Features & Architecture

- **Event-driven ingestion:** API Gateway only validates and publishes to RabbitMQ; consumers handle DB writes and campaign delivery asynchronously.
- **Customer & order management:** Add, view, and search customers/orders. Each customer has a unique `customer_id`.
- **Campaign creation:** Visual rule builder (AND/OR), AI-powered rule suggestions, audience preview, and message suggestions.
- **Campaign delivery:** Fan-out to all matching customers, simulated delivery with real-time status updates.
- **AI integration:** Natural language to rules, message suggestions, and more (see AI Service).
- **Authentication:** Google OAuth 2.0, JWT-based protection for all sensitive endpoints.
- **Modern frontend:** Next.js, accessible, responsive, and robust error handling.
- **Full Docker orchestration:** All services can be run together or individually.

---

## 🧪 Testing & Usage

- **Sign in** with Google to access all features.
- **Add customers/orders** via the UI.
- **Create campaigns** with rule builder and AI features.
- **Preview audience size** before saving a campaign.
- **View campaign history** and delivery stats.
- **Try AI features** for rule and message suggestions.

---

## 📝 Development & Planning

- **Microservices**: Each service is independently deployable and testable.
- **Async, robust, and scalable**: All writes and deliveries are decoupled via RabbitMQ.
- **AI features**: Modular, can be extended with more endpoints or models.
- **Modern UX**: Navigation is decluttered, context actions are placed where needed.
- **Documentation**: Each service is documented for easy onboarding and troubleshooting.

---

## 🗂️ Database Schema

See [`db/init.sql`](db/init.sql) for all table definitions, including customers, orders, campaigns, communication_log, and users.

---

## 🧩 Extending & Customizing

- Add more AI features by extending the AI Service.
- Add more campaign analytics or customer engagement features.
- Integrate with real vendor APIs by replacing the vendor-simulator.

---

## 🆘 Troubleshooting

- See individual service READMEs for troubleshooting tips.
- Use `docker-compose logs <service>` to debug issues.
- Ensure all `.env` files are set up as per the examples.

---

## 📄 Assignment Requirements

See [`requirements.md`](requirements.md) for a mapping of assignment requirements to implementation.

---

## 📹 Demo & Submission

- Record a demo video (max 7 min) explaining features, approach, trade-offs, and AI features.
- Push code to a public GitHub repo.
- Deploy the project (Vercel, Render, Railway, etc.).
- Ensure README is up to date with setup, architecture, AI tools, and known limitations.

---

## 👤 Author

- **Assignment by:** Xeno
- **Demo by:** Aakash Chamola

---