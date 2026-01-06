import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // Send error to analytics/monitoring service
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: error.toString(),
                fatal: false
            });
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                }}>
                    <div style={{
                        maxWidth: '600px',
                        width: '100%',
                        background: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center'
                    }}>
                        {/* Error Icon */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 1.5rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            color: 'white'
                        }}>
                            ⚠️
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontSize: '1.75rem',
                            fontWeight: 700,
                            marginBottom: '0.75rem',
                            color: '#1a202c'
                        }}>
                            Oops! Something went wrong
                        </h1>

                        {/* Message */}
                        <p style={{
                            fontSize: '1rem',
                            color: '#718096',
                            marginBottom: '2rem',
                            lineHeight: 1.6
                        }}>
                            We're sorry for the inconvenience. An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                        </p>

                        {/* Error Details (Development Only) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details style={{
                                marginBottom: '2rem',
                                textAlign: 'left',
                                background: '#f7fafc',
                                padding: '1rem',
                                borderRadius: '8px',
                                fontSize: '0.875rem'
                            }}>
                                <summary style={{ cursor: 'pointer', fontWeight: 600, marginBottom: '0.5rem' }}>
                                    Error Details
                                </summary>
                                <pre style={{
                                    overflow: 'auto',
                                    fontSize: '0.75rem',
                                    color: '#e53e3e',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={this.handleReset}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                                onMouseOut={e => e.target.style.transform = 'scale(1)'}
                            >
                                Try Again
                            </button>

                            <button
                                onClick={() => window.location.href = '/'}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'white',
                                    color: '#667eea',
                                    border: '2px solid #667eea',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                                onMouseOut={e => e.target.style.transform = 'scale(1)'}
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
