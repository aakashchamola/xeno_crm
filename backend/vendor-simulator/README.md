# Vendor Simulator

The Vendor Simulator mimics a third-party vendor API. It randomly succeeds or fails delivery and posts delivery receipts back to the API Gateway. It is used to test campaign delivery and receipt handling in the system.

---

## Features

- **POST /send** endpoint to simulate message delivery
- **Randomly** returns `sent` (90%) or `failed` (10%)
- **Posts** delivery receipts back to the API Gateway
- **Health check** endpoint at `/health` (port 8005)

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

## Health Check

- `GET http://localhost:8005/health` returns `OK` if the service is running.

---

## Example Usage

### Simulate a delivery

```bash
curl -X POST http://localhost:8005/send \
  -H "Content-Type: application/json" \
  -d '{"campaignId":1,"customerId":1,"message":"Hi Mohit, here's 10% off…"}'
```

- The service will respond with `{ "vendorStatus": "sent" }` or `{ "vendorStatus": "failed" }`.
- It will POST a delivery receipt to the API Gateway automatically.

---

## Troubleshooting

- If the service fails to connect to the API Gateway, ensure the API Gateway is running and the `.env` value for `API_GATEWAY_URL` is correct.
- Use `npm start` in this directory to run the service standalone, or use Docker Compose for the full stack.
- Logs will show delivery receipt errors.

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