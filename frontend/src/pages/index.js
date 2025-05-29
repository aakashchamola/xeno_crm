import { useEffect, useState } from 'react';
import LoginButton from '../components/Auth/LoginButton';

export default function Home() {
  const [loggedOut, setLoggedOut] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#loggedout') {
      setLoggedOut(true);
      window.location.hash = '';
    }
    setIsLoggedIn(!!localStorage.getItem('jwt'));
  }, []);

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 32 }}>
      <h1 style={{ fontSize: 36, marginBottom: 8, color: "#0070f3" }}>Xeno CRM Demo</h1>
      <p style={{ fontSize: 20, color: "#444", marginBottom: 32 }}>
        <b>Xeno CRM</b> is a demo Customer Relationship Management platform built for the Xeno assignment. It lets you segment your customers, create and deliver campaigns, and leverage AI for smarter marketing—all in a modern, open-source stack.
      </p>
      {loggedOut && (
        <div style={{ color: 'green', marginBottom: 16 }}>
          You have been logged out.
        </div>
      )}
      {!isLoggedIn && (
        <div style={{ margin: "32px 0" }}>
          <LoginButton />
        </div>
      )}
      {isLoggedIn && (
        <div style={{ color: '#0070f3', marginTop: 24, fontWeight: 500 }}>
          Welcome! You are already signed in.
        </div>
      )}

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>What can you do here?</h2>
        <ul style={{ fontSize: 18, color: "#333", lineHeight: 1.7 }}>
          <li>
            <b>Ingest customer & order data:</b> Use documented APIs to add customers and orders.
          </li>
          <li>
            <b>Create targeted campaigns:</b> Use a visual rule builder to segment your audience with AND/OR logic.
          </li>
          <li>
            <b>Preview audience size:</b> Instantly see how many customers match your segment.
          </li>
          <li>
            <b>Leverage AI:</b> Generate segment rules from natural language, get message suggestions, auto-tag campaigns, and more.
          </li>
          <li>
            <b>Track campaign delivery:</b> See sent/failed stats and delivery logs in real time.
          </li>
          <li>
            <b>Secure access:</b> Only authenticated users (Google OAuth) can create/view campaigns.
          </li>
        </ul>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>How to use this app</h2>
        <ol style={{ fontSize: 18, color: "#333", lineHeight: 1.7 }}>
          <li>
            <b>Sign in with Google</b> (button above).
          </li>
          <li>
            Go to <b>New Campaign</b> to create a campaign and define your audience.
          </li>
          <li>
            Use the <b>Preview Segment Size</b> button to see your audience count.
          </li>
          <li>
            Try the <b>AI features</b> for rule suggestions, message ideas, and more.
          </li>
          <li>
            Save your campaign and view its status in <b>Campaign History</b>.
          </li>
        </ol>
      </section>

      <section style={{ marginTop: 40, color: "#888", fontSize: 16 }}>
        <div>
          <b>Tech stack:</b> Next.js, React, Node.js, MySQL, RabbitMQ, Docker, Hugging Face Transformers, Google OAuth
        </div>
        <div style={{ marginTop: 8 }}>
          <b>Assignment by:</b> Xeno | <b>Demo by:</b> Aakash Chamola
        </div>
      </section>
    </main>
  );
}