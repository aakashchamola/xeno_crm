import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!localStorage.getItem('jwt'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    window.location.href = '/#loggedout';
  };

  return (
    <div>
      {/* ...skip link and header... */}
      <header role="banner" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16, borderBottom: '1px solid #eee' }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Xeno CRM</h1>
        <nav aria-label="Main navigation" style={{ flex: 1 }}>
          {mounted && isLoggedIn && (
            <ul style={{ display: 'inline', listStyle: 'none', margin: 0, padding: 0 }}>
              <li style={{ display: 'inline', marginRight: 12 }}>
                <a href="/campaigns/new" tabIndex={0}>New Campaign</a>
              </li>
              <li style={{ display: 'inline' }}>
                <a href="/campaigns">Campaign History</a>
              </li>
            </ul>
          )}
        </nav>
        {mounted && isLoggedIn && <button onClick={handleLogout} aria-label="Logout">Logout</button>}
      </header>
      <main id="main-content" tabIndex={-1} style={{ padding: 24 }}>{children}</main>
    </div>
  );
}