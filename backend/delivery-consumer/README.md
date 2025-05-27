
---

## **Delivery Consumer** 

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