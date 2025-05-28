import '../styles/global.css';
import Layout from '../components/Layout/Layout';
import ErrorBoundary from '../components/ErrorBoundary/errorBoundary';

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ErrorBoundary>
  );
}