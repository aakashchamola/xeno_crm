# Vendor Simulator

The Vendor Simulator mimics a third-party vendor API. It randomly succeeds or fails delivery and posts delivery receipts back to the API Gateway. It is used to test campaign delivery and receipt handling in the system.

---

## Features

- **POST /send** endpoint to simulate message delivery
- **Randomly** returns `sent` (90%) or `failed` (10%)
- **Posts** delivery receipts back to the API Gateway (using string `customerId` and `campaignId`)
- **Robust logging** for all requests, payloads, and errors
- **Health check** endpoint at `/health` (port 8005)

---

## Environment Variables

See `.env.example` for all required variables:
- `PORT` — Port to run the vendor simulator (default: 8005)
- `API_GATEWAY_URL` — URL of the API Gateway delivery receipt endpoint (e.g., http://localhost:8002/deliveryReceipts)
- `JWT_SECRET` — Must match the API Gateway's JWT_SECRET. Used to generate a service JWT for posting delivery receipts. **Required for successful delivery receipt posting.**

---

## Running the Vendor Simulator Individually

### 1. Install dependencies

```bash
cd backend/vendor-simulator
npm install
```

### 2. Create a `.env` file in `backend/vendor-simulator/` with the following variables:

```
PORT=8005
API_GATEWAY_URL=http://localhost:8002/delivery-receipts
```

- Make sure the API Gateway is running and accessible at the above address.

### 3. Start the service

```bash
npm start
```

The Vendor Simulator will be available at [http://localhost:8005](http://localhost:8005)

---

## Running with Docker

This service is fully Dockerized. To run with Docker Compose (recommended for local dev):

```bash
docker-compose up --build
```

---

## Health Check

- `GET http://localhost:8005/health` returns `OK` if the service is running.

---

## Example Usage

### Simulate a delivery

```bash
curl -X POST http://localhost:8005/send \
  -H "Content-Type: application/json" \
  -d '{"campaignId":"CMP123","customerId":"CUST456","message":"Hi Mohit, here\'s 10% off…"}'
```

- The service will respond with `{ "vendorStatus": "sent" }` or `{ "vendorStatus": "failed" }`.
- It will POST a delivery receipt to the API Gateway automatically (using string IDs).

---

## Troubleshooting

- If the service fails to connect to the API Gateway, ensure the API Gateway is running and the `.env` value for `API_GATEWAY_URL` is correct.
- Use `npm start` in this directory to run the service standalone, or use Docker Compose for the full stack.
- Logs will show delivery receipt errors and payloads.
- If you see `401 Unauthorized` errors when sending delivery receipts, ensure `JWT_SECRET` in your `.env` matches the API Gateway's value. The vendor-simulator uses this to generate a service JWT for the Authorization header.
- If you see DB errors about type mismatches, ensure your schema matches the latest `init.sql` (all customer references are strings).
- For full stack orchestration, use Docker Compose as described above.

---

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