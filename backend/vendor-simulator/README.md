
---

## **Vendor Simulator**

```md
# Vendor Simulator

The Vendor Simulator mimics a third-party vendor API. It randomly succeeds or fails delivery and posts delivery receipts back to the API Gateway.

---

## Features

- **POST /send** endpoint to simulate message delivery
- **Randomly** returns `sent` (90%) or `failed` (10%)
- **Posts** delivery receipts back to the API Gateway

---

## Usage

### Start via Docker Compose

```bash
docker-compose up --build