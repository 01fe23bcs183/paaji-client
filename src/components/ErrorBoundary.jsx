// Error Boundary Component - Catches React errors gracefully
import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        // In production, you could send this to an error tracking service
        if (import.meta.env.VITE_SENTRY_DSN) {
            // TODO: Send to Sentry when configured
            console.log('Would send to Sentry:', { error, errorInfo });
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="error-boundary">
                    <div className="error-boundary-content">
                        <h2>Something went wrong</h2>
                        <p>We apologize for the inconvenience. Please try again.</p>
                        
                        {import.meta.env.DEV && this.state.error && (
                            <details className="error-details">
                                <summary>Error Details (Development Only)</summary>
                                <pre>{this.state.error.toString()}</pre>
                                {this.state.errorInfo && (
                                    <pre>{this.state.errorInfo.componentStack}</pre>
                                )}
                            </details>
                        )}
                        
                        <div className="error-actions">
                            <button onClick={this.handleRetry} className="btn-primary">
                                Try Again
                            </button>
                            <button onClick={() => window.location.href = '/'} className="btn-secondary">
                                Go to Home
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
