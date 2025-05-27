# API Gateway

The API Gateway is the main entry point for all backend REST APIs in the Xeno CRM system. It handles request validation, JWT authentication, and publishes messages to RabbitMQ for asynchronous processing by downstream consumers.

---

## Features

- **RESTful APIs** for customers, orders, campaigns, and delivery receipts
- **JWT authentication** for all endpoints (except `/health`and `/api-docs`)
- **Request validation** using Joi
- **Swagger UI** documentation at `/api-docs`
- **Publishes** all write operations to RabbitMQ queues for async processing

---

## Endpoints

| Method | Path                | Description                        | Auth Required |
|--------|---------------------|------------------------------------|--------------|
| POST   | `/customers`        | Ingest customer data               | Yes          |
| POST   | `/orders`           | Ingest order data                  | Yes          |
| POST   | `/campaigns`        | Create a campaign                  | Yes          |
| POST   | `/deliveryReceipts` | Accept delivery receipt            | Yes          |
| GET    | `/health`           | Health check                       | No           |
| GET    | `/api-docs`         | Swagger UI                         | No           |

---

## Usage

### Start via Docker Compose

```bash
docker-compose up --build