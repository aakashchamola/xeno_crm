import Link from 'next/link';

export default function Layout({ children }) {
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    window.location.href = '/#loggedout';
  };

  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('jwt');

  return (
    <div>
      <a href="#main-content" className="skip-link" style={{
        position: 'absolute', left: '-999px', top: 'auto', width: '1px', height: '1px',
        overflow: 'hidden', zIndex: 1000, background: '#fff', color: '#0070f3'
      }}
      onFocus={e => e.target.style.left = '0'}
      onBlur={e => e.target.style.left = '-999px'}
      >Skip to main content</a>
      <header role="banner" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16, borderBottom: '1px solid #eee' }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Xeno CRM</h1>
        <nav aria-label="Main navigation" style={{ flex: 1 }}>
          {isLoggedIn && (
            <ul style={{ display: 'inline', listStyle: 'none', margin: 0, padding: 0 }}>
              <li style={{ display: 'inline', marginRight: 12 }}>
                <Link href="/campaigns/new" tabIndex={0}>New Campaign</Link>
              </li>
              <li style={{ display: 'inline' }}>
                <Link href="/campaigns">Campaign History</Link>
              </li>
            </ul>
          )}
        </nav>
        {isLoggedIn && <button onClick={handleLogout} aria-label="Logout">Logout</button>}
      </header>
      <main id="main-content" tabIndex={-1} style={{ padding: 24 }}>{children}</main>
    </div>
  );
}