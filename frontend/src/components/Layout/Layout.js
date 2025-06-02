import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

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

  // Navigation links
  const navLinks = [
    { href: '/campaigns/new', label: 'New Campaign' },
    { href: '/campaigns', label: 'Campaign History' },
    { href: '/customers', label: 'View Customers' },
    { href: '/orders', label: 'View Orders' },
  ];

  return (
    <div>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header role="banner" className="main-header">
        <a href="/" aria-label="Xeno CRM Home" className="logo-link">
          <img src="/logo.svg" alt="" className="logo-img" />
          <span className="logo-text">Xeno CRM</span>
        </a>
        {mounted && isLoggedIn && (
          <>
            {/* Desktop Nav */}
            <nav aria-label="Main navigation" className="main-nav">
              <ul>
                {navLinks.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      tabIndex={0}
                      className={typeof window !== 'undefined' && window.location.pathname === link.href ? 'active' : ''}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            {/* Mobile Nav Toggle */}
            <button
              className="mobile-nav-toggle"
              aria-label="Open navigation menu"
              aria-expanded={mobileNav}
              onClick={() => setMobileNav(v => !v)}
            >
              <span className="hamburger" />
            </button>
            {/* Mobile Nav Drawer */}
            {mobileNav && (
              <nav className="mobile-nav" aria-label="Mobile navigation">
                <ul>
                  {navLinks.map(link => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        tabIndex={0}
                        className={typeof window !== 'undefined' && window.location.pathname === link.href ? 'active' : ''}
                        onClick={() => setMobileNav(false)}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {/* User menu */}
            <div
              className="user-menu"
              tabIndex={0}
              onBlur={e => {
                // Only close if focus moves outside the dropdown
                if (!e.currentTarget.contains(e.relatedTarget)) setShowMenu(false);
              }}
            >
              <button
                className="user-btn"
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={showMenu}
                onClick={() => setShowMenu(v => !v)}
              >
                {user?.photo ? (
                  <img src={user.photo} alt="User avatar" className="user-avatar" />
                ) : (
                  <span className="user-initials">{user?.displayName?.[0] || '?'}</span>
                )}
                <span className="user-name">{user?.displayName}</span>
                <span className="chevron">▼</span>
              </button>
              {showMenu && (
                <ul className="user-dropdown" role="menu">
                  <li role="menuitem">
                    <button
                      onMouseDown={handleLogout}
                      className="logout-btn"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </>
        )}
      </header>
      <main id="main-content" tabIndex={-1} className="main-content">
        {children}
      </main>
      <footer className="main-footer">
        &copy; {new Date().getFullYear()} Xeno CRM Demo &mdash; Assignment Project
      </footer>
      <style jsx global>{`
        .main-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          height: 64px;
          background: #fff;
          border-bottom: 1px solid #eee;
          box-shadow: 0 2px 8px #f3f3f3;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #0070f3;
        }
        .logo-img { height: 36px; margin-right: 12px; }
        .logo-text { font-weight: 700; font-size: 26px; letter-spacing: 1px; }
        .main-nav ul {
          display: flex;
          gap: 24px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .main-nav a {
          font-weight: 500;
          color: #222;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 4px;
          transition: background 0.2s, color 0.2s;
        }
        .main-nav a.active, .main-nav a:focus, .main-nav a:hover {
          background: #0070f3;
          color: #fff;
        }
        .user-menu {
          position: relative;
          margin-left: 24px;
          display: inline-block;
        }
        .user-btn {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          font: inherit;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .user-btn:focus {
          outline: 2px solid #0070f3;
        }
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #eee;
          margin-right: 8px;
        }
        .user-initials {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #0070f3;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin-right: 8px;
        }
        .user-name { font-weight: 500; margin-right: 6px; }
        .chevron { font-size: 12px; color: #888; }
        .user-dropdown {
          position: absolute;
          right: 0;
          top: 110%;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 6px;
          box-shadow: 0 2px 8px #eee;
          min-width: 120px;
          z-index: 200;
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .user-dropdown li { padding: 0; }
        .logout-btn {
          width: 100%;
          background: none;
          border: none;
          color: #b00020;
          font-weight: 500;
          padding: 10px 16px;
          text-align: left;
          border-radius: 6px;
          cursor: pointer;
        }
        .logout-btn:hover, .logout-btn:focus {
          background: #fff0f0;
        }
        .main-content {
          padding: 32px;
          min-height: 80vh;
          background: #f9f9f9;
        }
        .main-footer {
          text-align: center;
          color: #888;
          padding: 20px;
          background: #fafafa;
          border-top: 1px solid #eee;
          font-size: 16px;
          letter-spacing: 0.2px;
        }
        .mobile-nav-toggle {
          display: none;
          background: none;
          border: none;
          margin-left: 16px;
          cursor: pointer;
        }
        .hamburger {
          display: block;
          width: 28px;
          height: 3px;
          background: #0070f3;
          border-radius: 2px;
          position: relative;
        }
        .hamburger::before, .hamburger::after {
          content: '';
          position: absolute;
          left: 0;
          width: 28px;
          height: 3px;
          background: #0070f3;
          border-radius: 2px;
        }
        .hamburger::before { top: -8px; }
        .hamburger::after { top: 8px; }
        .mobile-nav {
          display: none;
        }
        @media (max-width: 900px) {
          .main-header { padding: 0 12px; }
          .main-content { padding: 12px; }
        }
        @media (max-width: 700px) {
          .main-nav { display: none; }
          .mobile-nav-toggle { display: block; }
          .mobile-nav {
            display: block;
            position: absolute;
            top: 64px;
            left: 0;
            width: 100vw;
            background: #fff;
            box-shadow: 0 2px 8px #eee;
            z-index: 150;
          }
          .mobile-nav ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
          }
          .mobile-nav a {
            padding: 16px;
            font-size: 18px;
            color: #0070f3;
            text-decoration: none;
            border-bottom: 1px solid #eee;
            background: #fff;
          }
          .mobile-nav a.active, .mobile-nav a:focus, .mobile-nav a:hover {
            background: #f0f8ff;
            color: #0070f3;
          }
        }
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
      `}</style>
    </div>
  );
}