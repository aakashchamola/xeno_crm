const API_URL = process.env.NEXT_PUBLIC_GOOGLEAUTH_URL;
export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <button onClick={handleLogin} aria-label="Sign in with Google">
      Sign in with Google
    </button>
  );
}