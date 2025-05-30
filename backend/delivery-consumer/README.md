# Delivery Consumer

The Delivery Consumer service handles campaign fan-out and delivery receipt processing. It listens to RabbitMQ for new campaigns, sends messages to the vendor simulator, and updates delivery statuses in MySQL. It is responsible for campaign delivery and logging, decoupling the API from delivery logic.

---

## Features

- **Consumes** `campaigns` and `deliveryReceipts` queues from RabbitMQ
- **Fans out** campaign messages to each customer via the vendor simulator
- **Updates** delivery status in `communication_log` table upon receipt
- **Health check** endpoint at `/health` (port 8008)

---

## Running the Delivery Consumer Individually

### 1. Install dependencies

```bash
cd backend/delivery-consumer
npm install
```

### 2. Create a `.env` file in `backend/delivery-consumer/` with the following variables:

```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=xeno_crm
RABBITMQ_URL=amqp://localhost
VENDOR_API_URL=http://localhost:8005/send
```

- Make sure MySQL, RabbitMQ, and the Vendor Simulator are running and accessible at the above addresses.
- The database schema should match the one in `db/init.sql`.

### 3. Start the service

```bash
npm start
```

The consumer will listen for messages on the `campaigns` and `deliveryReceipts` queues and process them accordingly.

---

## Health Check

- `GET http://localhost:8008/health` returns `{ status: 'ok' }` if the service is running.

---

## Example Usage

- This service is not called directly; it consumes messages published by the API Gateway.
- To test, POST a campaign to the API Gateway, and verify delivery logs and stats in MySQL.

---

## Troubleshooting

- If the service fails to connect to MySQL, RabbitMQ, or the Vendor Simulator, ensure those services are running and the `.env` values are correct.
- Use `npm start` in this directory to run the service standalone, or use Docker Compose for the full stack.
- Logs will show connection errors and delivery failures.
- Duplicate communication logs are skipped and logged as warnings.

---

```md
# Delivery Consumer

The Delivery Consumer service handles campaign fan-out and delivery receipt processing. It listens to RabbitMQ for new campaigns, sends messages to the vendor simulator, and updates delivery statuses in MySQL.

---

## Features

- **Consumes** `campaigns` and `deliveryReceipts` queues from RabbitMQ
- **Fans out** campaign messages to each customer via the vendor simulator
- **Updates** delivery status in `communication_log` table upon receipt

---

## Usage

### Start via Docker Compose

```bash
docker-compose up --build