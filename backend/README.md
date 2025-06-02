# Xeno CRM Backend

This folder contains all backend microservices for the Xeno CRM assignment, built with Node.js, Express, RabbitMQ, MySQL, and Docker.

---

## Services

- **api-gateway**: Exposes REST APIs, handles validation, authentication (JWT), and documentation (Swagger).
- **ingestion-consumer**: Consumes customer/order data from RabbitMQ and persists to MySQL.
- **delivery-consumer**: Handles campaign fan-out, calls the vendor-simulator, and updates delivery receipts. All delivery and logging is by external `customer_id` (string).
- **vendor-simulator**: Simulates a third-party vendor, randomly succeeds/fails, and posts delivery receipts back. All payloads use string `customerId` and `campaignId`.
- **auth-service**: Manages Google OAuth login and issues JWTs for authenticated users.

---

## Folder Structure

```
backend/
  api-gateway/
  ingestion-consumer/
  delivery-consumer/
  vendor-simulator/
  auth-service/
  shared/
  README.md
```

---

## Running Locally

1. **Install Docker and Docker Compose** if not already installed.
2. **Clone the repo** and navigate to the project root.
3. **Start all services:**
   ```bash
   docker-compose up --build
   ```
   This will spin up all backend services, RabbitMQ, and MySQL.

4. **Access Service UIs:**
   - RabbitMQ Management: [http://localhost:15672](http://localhost:15672) (user/pass: guest/guest)
   - API Gateway Swagger Docs: [http://localhost:8002/api-docs](http://localhost:8002/api-docs)

---

## API Usage

### Authentication

All endpoints (except `/health`) require a Bearer JWT in the `Authorization` header.  
Obtain a JWT by logging in via the `/auth/google` endpoint in `auth-service`.

### Example: Ingest Customer

```bash
curl -X POST http://localhost:8002/customers \
  -H "Authorization: Bearer <your_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mohit Sharma","email":"mohit@example.com"}'
```

### Example: Ingest Order

```bash
curl -X POST http://localhost:8002/orders \
  -H "Authorization: Bearer <your_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"orderId":"ORD123","customerId":"CUST456","amount":1200.5,"date":"2024-05-27T10:00:00Z"}'
```

### Example: Create Campaign

```bash
curl -X POST http://localhost:8002/campaigns \
  -H "Authorization: Bearer <your_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Summer Sale","segmentRules":[{"field":"spend","op":">","value":10000}],"message":"Hi Mohit, here's 10% off…","customerIds":["CUST456","CUST789"]}'
```

### Example: Delivery Receipt

```bash
curl -X POST http://localhost:8002/delivery-receipts \
  -H "Authorization: Bearer <your_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"campaignId":"CMP123","customerId":"CUST456","status":"sent","timestamp":"2024-05-27T10:05:00Z"}'
```

### API Documentation

Visit [http://localhost:8002/api-docs](http://localhost:8002/api-docs) for interactive Swagger UI.

---

## Environment Variables

Each service uses its own `.env` or environment variables (see `docker-compose.yml` for examples).  
- MySQL: `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
- RabbitMQ: `RABBITMQ_URL`
- Auth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `JWT_SECRET`, etc.

---

## Database Schema

See [`db/init.sql`](../db/init.sql) for all table definitions.
- All references to customers are by `customer_id` (string), not internal `id`.
- `communication_log` and `orders` use `customer_id` as a foreign key to `customers.customer_id`.

---

## Development Notes

- Each service is a standalone Node.js app with its own dependencies.
- All services are containerized for easy orchestration.
- Shared code can be placed in `backend/shared/` if needed.
- For production, robust logging and error handling are implemented in all services.

---

## Troubleshooting

- If a service fails to connect to MySQL or RabbitMQ, ensure those containers are healthy.
- Use `docker-compose logs <service>` to debug issues.
- For Google OAuth, set up credentials in the Google Developer Console and update your `.env`.
- If you see DB errors about type mismatches, ensure your schema matches the latest `init.sql` (all customer references are strings).

---
