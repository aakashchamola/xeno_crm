# API Gateway

The API Gateway is the main entry point for all backend REST APIs in the Xeno CRM system. It handles request validation, JWT authentication, and publishes messages to RabbitMQ for asynchronous processing by downstream consumers.

---

## Features

- **RESTful APIs** for customers, orders, campaigns, delivery receipts, and segment preview
- **JWT authentication** for all endpoints (except `/health` and `/api-docs`)
- **Request validation** using Joi
- **Swagger UI** documentation at `/api-docs` (only service with Swagger)
- **Publishes** all write operations to RabbitMQ queues for async processing
- **Generates unique `customer_id`** for each customer (e.g., `CUST-<uuid>`, string)

---

## Endpoints

| Method | Path                | Description                        | Auth Required |
|--------|---------------------|------------------------------------|--------------|
| POST   | `/customers`        | Ingest customer data               | Yes          |
| GET    | `/customers`        | List all customers                 | Yes          |
| POST   | `/orders`           | Ingest order data                  | Yes          |
| GET    | `/orders`           | List all orders                    | Yes          |
| POST   | `/campaigns`        | Create a campaign                  | Yes          |
| GET    | `/campaigns`        | List all campaigns                 | Yes          |
| GET    | `/campaigns/{id}`   | Get campaign by ID                 | Yes          |
| POST   | `/delivery-receipts`| Accept delivery receipt            | Yes          |
| POST   | `/preview`          | Preview segment size               | Yes          |
| GET    | `/health`           | Health check                       | No           |
| GET    | `/api-docs`         | Swagger UI                         | No           |

---

## Running the API Gateway Individually

### 1. Install dependencies

```bash
cd backend/api-gateway
npm install
```

### 2. Create a `.env` file in `backend/api-gateway/` with the following variables:

```
PORT=8002
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=xeno_crm
RABBITMQ_URL=amqp://localhost
JWT_SECRET=your_jwt_secret
```

- Make sure MySQL and RabbitMQ are running and accessible at the above addresses.
- The JWT secret must match the one used by the Auth Service.

### 3. Start the service

```bash
npm start
```

The API Gateway will be available at [http://localhost:8002](http://localhost:8002)

---

## Running with Docker

This service is fully Dockerized. To run with Docker Compose (recommended for local dev):

```bash
docker-compose up --build
```

---

## Health Check

- `GET /health` returns `{ status: 'ok' }` if the service is running.

---

## Swagger/OpenAPI

- Swagger UI is available at `/api-docs` ([http://localhost:8002/api-docs](http://localhost:8002/api-docs))
- This is the **only service** in the project with Swagger/OpenAPI documentation, as required by the assignment.

---

## Example Usage

### Authentication

All endpoints (except `/health` and `/api-docs`) require a Bearer JWT in the `Authorization` header. Obtain a JWT by logging in via the `/auth/google` endpoint in `auth-service`.

### Example: Ingest Customer

```bash
curl -X POST http://localhost:8002/customers \
  -H "Authorization: Bearer <your_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mohit Sharma","email":"mohit@example.com"}'
```

### Example: Preview Segment Size

```bash
curl -X POST http://localhost:8002/preview \
  -H "Authorization: Bearer <your_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"segmentRules": {"combinator": "and", "rules": [{"field": "spend", "op": ">", "value": 10000}]}}'
```

### Example: Ingest Order

```bash
curl -X POST http://localhost:8002/orders \
  -H "Authorization: Bearer <your_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"orderId":"ORD123","customerId":"CUST456","amount":1200.5,"date":"2024-05-27T10:00:00Z"}'
```

### Example: Delivery Receipt

```bash
curl -X POST http://localhost:8002/delivery-receipts \
  -H "Authorization: Bearer <your_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"campaignId":"CMP123","customerId":"CUST456","status":"sent","timestamp":"2024-05-27T10:05:00Z"}'
```

---

## Troubleshooting

- If the service fails to connect to MySQL or RabbitMQ, ensure those services are running and the `.env` values are correct.
- Use `npm start` in this directory to run the service standalone, or use Docker Compose for the full stack.
- Logs will show connection errors and validation failures.
- For JWT errors, ensure your Auth Service and API Gateway use the same `JWT_SECRET`.
- For full stack orchestration, use Docker Compose as described above.
- If you see DB errors about type mismatches, ensure your schema matches the latest `init.sql` (all customer references are strings).

---