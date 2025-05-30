# Xeno CRM Frontend

This is the Next.js frontend for the Xeno CRM assignment. It provides a modern, accessible UI for campaign creation, customer/order ingestion, campaign history, and AI-powered features.

---

## Features

- **Google OAuth 2.0** authentication (via Auth Service)
- **Campaign creation** with dynamic rule builder (AND/OR logic)
- **Customer and order ingestion** forms
- **Order creation now validates Customer ID**: The API checks that the customer exists before accepting the order, and the UI shows an error if not.
- **Campaign history** with delivery stats and detail view
- **AI-powered features:**
  - Natural language to segment rules (AI rule suggestion)
  - AI message suggestions
  - *(Other AI features like lookalike, auto-tag, and send-time are present in code but commented for future upgrades)*
- **Modern, responsive layout** with:
  - Horizontal nav bar and user dropdown menu
  - Mobile navigation drawer for small screens
  - Visually appealing, compact header and footer
  - Active link highlighting and improved spacing
- **RuleBuilder auto-fills date pickers** from ISO date rules (from AI or backend)
- **Accessible, robust error handling** throughout

---

## Setup & Running Locally

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Create a `.env` file** (see `.env.example` for required variables):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8002
   NEXT_PUBLIC_AI_URL=http://localhost:8004
   NEXT_PUBLIC_GOOGLEAUTH_URL=http://localhost:8003
   ```

3. **Start the frontend**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:8001](http://localhost:3001)

---

## Environment Variables

See `.env.example` for all required variables:
- `NEXT_PUBLIC_API_URL` — URL of the API Gateway (backend)
- `NEXT_PUBLIC_AI_URL` — URL of the AI Service
- `NEXT_PUBLIC_GOOGLEAUTH_URL` — URL of the Auth Service (Google OAuth)

---

## Usage

- **Sign in** with Google to access all features.
- **Add customers/orders** via the navigation menu.
- **Order creation:** You must enter a valid Customer ID. If the customer does not exist, you will see an error and the order will not be accepted.
- **Create campaigns** using the rule builder and AI features.
- **View campaign history** and delivery stats.
- **AI features:** Only two are enabled by default (AI rule suggestion and message suggestions). Others are present in code, commented for future upgrades.
- **Modern layout:** Enjoy a visually appealing, mobile-friendly, and accessible UI with a user dropdown and mobile navigation.
- **Date rules:** If a rule from AI or backend is an ISO date, the date picker in the rule builder will auto-fill with the correct value.

---

## Troubleshooting

- If you see network errors, ensure the backend, AI, and auth services are running and `.env` values are correct.
- For Google OAuth, ensure your credentials and callback URLs are set up in the backend.
- For CORS issues, check that all services allow requests from the frontend URL.

---

## Accessibility & Mobile

- The UI is accessible (ARIA, keyboard navigation, focus management) and mobile-friendly.
- Navigation and user menu are fully keyboard accessible.

---

