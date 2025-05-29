import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // Optionally log error
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          color: '#b00020',
          background: '#fff0f0',
          padding: 24,
          borderRadius: 8,
          margin: 32,
          textAlign: 'center'
        }}>
          <h2>Something went wrong</h2>
          <div>{this.state.error?.message}</div>
          <button onClick={this.handleReload} style={{ marginTop: 16 }}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}