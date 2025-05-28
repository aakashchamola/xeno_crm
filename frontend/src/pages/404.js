export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <h1 tabIndex={0}>404 – Page Not Found</h1>
      <p>Sorry, the page you’re looking for doesn’t exist.</p>
      <a href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>Go to Home</a>
    </div>
  );
}