# Auth Service

The Auth Service manages Google OAuth login and issues JWTs for authenticated users. It is responsible for authentication and user session management in the Xeno CRM system.

---

## Features

- **Google OAuth 2.0** login flow
- **Issues JWTs** for authenticated users
- **Redirects** to frontend with JWT token
- **Health check** endpoint at `/health` (port 8003)

---

## Running the Auth Service Individually

### 1. Install dependencies

```bash
cd backend/auth-service
npm install
```

### 2. Create a `.env` file in `backend/auth-service/` with the following variables:

```
PORT=8003
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8003/auth/google/callback
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

- Set up a Google OAuth 2.0 app in the Google Developer Console and use the credentials above.
- The JWT secret must match the one used by the API Gateway.
- The callback URL must match what you set in Google Cloud.

### 3. Start the service

```bash
npm start
```

The Auth Service will be available at [http://localhost:8003](http://localhost:8003)

---

## Health Check

- `GET http://localhost:8003/health` returns `{ status: 'ok' }` if the service is running.

---

## Example Usage

- To start the login flow, visit: [http://localhost:8003/auth/google](http://localhost:8003/auth/google)
- On successful login, you will be redirected to the frontend with a JWT token in the URL.

---

## Troubleshooting

- If the service fails to connect to Google, check your OAuth credentials and callback URL.
- If JWTs are not accepted by the API Gateway, ensure both use the same `JWT_SECRET`.
- Use `npm start` in this directory to run the service standalone, or use Docker Compose for the full stack.
- Logs will show authentication and token errors.

---

```md
# Auth Service

The Auth Service manages Google OAuth login and issues JWTs for authenticated users.

---

## Features

- **Google OAuth 2.0** login flow
- **Issues JWTs** for authenticated users
- **Redirects** to frontend with JWT token

---

## Usage

### Start via Docker Compose

```bash
docker-compose up --build