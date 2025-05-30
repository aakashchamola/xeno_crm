# Ingestion Consumer

The Ingestion Consumer service listens to RabbitMQ queues for customer and order data, and persists them to the MySQL database asynchronously. It is responsible for decoupling API ingestion from database writes, improving reliability and scalability.

---

## Features

- **Consumes** `customers` and `orders` queues from RabbitMQ
- **Persists** customer and order data to MySQL
- **Handles** errors gracefully (logs and nacks failed messages)
- **Health check** endpoint at `/health` (port 8007)

---

## Running the Ingestion Consumer Individually

### 1. Install dependencies

```bash
cd backend/ingestion-consumer
npm install
```

### 2. Create a `.env` file in `backend/ingestion-consumer/` with the following variables:

```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=xeno_crm
RABBITMQ_URL=amqp://localhost
```

- Make sure MySQL and RabbitMQ are running and accessible at the above addresses.
- The database schema should match the one in `db/init.sql`.

### 3. Start the service

```bash
npm start
```

The consumer will listen for messages on the `customers` and `orders` queues and write them to MySQL.

---

## Health Check

- `GET http://localhost:8007/health` returns `{ status: 'ok' }` if the service is running.

---

## Example Usage

- This service is not called directly; it consumes messages published by the API Gateway.
- To test, POST customer/order data to the API Gateway, and verify records appear in MySQL.

---

## Troubleshooting

- If the service fails to connect to MySQL or RabbitMQ, ensure those services are running and the `.env` values are correct.
- Use `npm start` in this directory to run the service standalone, or use Docker Compose for the full stack.
- Logs will show connection errors and validation failures.
- Duplicate records are skipped and logged as warnings.

---

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