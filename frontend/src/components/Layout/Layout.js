import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!localStorage.getItem('jwt'));
    try {
      const userObj = JSON.parse(localStorage.getItem('user'));
      setUser(userObj);
    } catch {
      setUser(null);
    }
  }, []);

const handleLogout = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
  window.location.assign('/#loggedout');
  window.location.reload();
};
  return (
    <div>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header
        role="banner"
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          padding: '0 24px',
          height: 64,
          borderBottom: '1px solid #eee',
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 8px #f3f3f3"
        }}
      >
        <a href="/" aria-label="Xeno CRM Home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#0070f3' }}>
          <img src="/logo.svg" alt="" style={{ height: 36, marginRight: 12 }} />
          <span style={{ fontWeight: 700, fontSize: 26, letterSpacing: 1 }}>Xeno CRM</span>
        </a>
        <nav aria-label="Main navigation" style={{ flex: 1 }}>
          {mounted && isLoggedIn && (
            <ul style={{ display: 'flex', gap: 20, listStyle: 'none', margin: 0, padding: 0 }}>
              <li>
                <a href="/campaigns/new" tabIndex={0} style={{ fontWeight: 500 }}>New Campaign</a>
              </li>
              <li>
                <a href="/campaigns" tabIndex={0} style={{ fontWeight: 500 }}>Campaign History</a>
              </li>
            </ul>
          )}
        </nav>
        {mounted && isLoggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user?.displayName && (
              <span style={{ fontWeight: 500 }}>{user.displayName}</span>
            )}
            {user?.photo && (
              <img
                src={user.photo}
                alt="User avatar"
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }}
              />
            )}
            <button onClick={handleLogout} aria-label="Logout" style={{ marginLeft: 8 }}>
              Logout
            </button>
          </div>
        )}
      </header>
      <main id="main-content" tabIndex={-1} style={{ padding: 24, minHeight: "80vh", background: "#f9f9f9" }}>
        {children}
      </main>
      <footer style={{
        textAlign: "center",
        color: "#888",
        padding: 20,
        background: "#fafafa",
        borderTop: "1px solid #eee",
        fontSize: 16,
        letterSpacing: 0.2
      }}>
        &copy; {new Date().getFullYear()} Xeno CRM Demo &mdash; Assignment Project
      </footer>
      <style jsx global>{`
        .skip-link {
          position: absolute;
          left: -999px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
          z-index: 1000;
        }
        .skip-link:focus {
          left: 16px;
          top: 16px;
          width: auto;
          height: auto;
          background: #0070f3;
          color: #fff;
          padding: 8px 16px;
          border-radius: 4px;
          outline: 2px solid #0070f3;
        }
        @media (max-width: 600px) {
          header[role="banner"] {
            flex-direction: column;
            height: auto;
            padding: 12px;
            gap: 8px;
          }
          main {
            padding: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}