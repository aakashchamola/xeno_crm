import { useEffect, useState } from 'react';
import LoginButton from '../components/Auth/LoginButton';

export default function Home() {
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#loggedout') {
      setLoggedOut(true);
      window.location.hash = '';
    }
  }, []);

  return (
    <main>
      <h1>Xeno CRM</h1>
      {loggedOut && (
        <div style={{ color: 'green', marginBottom: 16 }}>
          You have been logged out.
        </div>
      )}
      <LoginButton />
    </main>
  );
}