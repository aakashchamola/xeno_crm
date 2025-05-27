
---

## **Ingestion Consumer**

```md
# Ingestion Consumer

The Ingestion Consumer service listens to RabbitMQ queues for customer and order data, and persists them to the MySQL database asynchronously.

---

## Features

- **Consumes** `customers` and `orders` queues from RabbitMQ
- **Persists** customer and order data to MySQL
- **Handles** errors gracefully (logs and nacks failed messages)

---

## Usage

### Start via Docker Compose

```bash
docker-compose up --build