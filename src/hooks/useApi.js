import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for API calls with error handling and retry logic
 * 
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export const useApi = (apiFunction, options = {}) => {
    const {
        maxRetries = 3,
        retryDelay = 1000,
        onSuccess = null,
        onError = null,
        autoExecute = false
    } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(autoExecute);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const abortControllerRef = useRef(null);

    const execute = useCallback(async (...args) => {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        let attempt = 0;
        let lastError = null;

        while (attempt < maxRetries) {
            try {
                const result = await apiFunction(...args, {
                    signal: abortControllerRef.current.signal
                });

                setData(result);
                setError(null);
                setRetryCount(0);
                setLoading(false);

                if (onSuccess) {
                    onSuccess(result);
                }

                return result;

            } catch (err) {
                lastError = err;

                // Don't retry on abort or 4xx errors (except 429)
                if (
                    err.name === 'AbortError' ||
                    (err.response?.status >= 400 &&
                        err.response?.status < 500 &&
                        err.response?.status !== 429)
                ) {
                    break;
                }

                attempt++;
                setRetryCount(attempt);

                // Wait before retrying (exponential backoff)
                if (attempt < maxRetries) {
                    await new Promise(resolve =>
                        setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1))
                    );
                }
            }
        }

        // All retries failed
        setError(lastError);
        setLoading(false);
        setRetryCount(0);

        if (onError) {
            onError(lastError);
        }

        throw lastError;

    }, [apiFunction, maxRetries, retryDelay, onSuccess, onError]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
        setRetryCount(0);

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }, []);

    // Cleanup on unmount
    useCallback(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        data,
        loading,
        error,
        retryCount,
        execute,
        reset
    };
};

/**
 * Helper function to handle API errors
 */
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error status
        return {
            message: error.response.data?.message || 'Server error occurred',
            status: error.response.status,
            data: error.response.data
        };
    } else if (error.request) {
        // Request made but no response
        return {
            message: 'No response from server. Please check your connection.',
            status: 0,
            data: null
        };
    } else {
        // Error in request setup
        return {
            message: error.message || 'An unexpected error occurred',
            status: -1,
            data: null
        };
    }
};

/**
 * Retry a failed API call with exponential backoff
 */
export const retryApiCall = async (
    apiCall,
    maxRetries = 3,
    baseDelay = 1000
) => {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await apiCall();
        } catch (error) {
            lastError = error;

            // Don't retry on client errors
            if (error.response?.status >= 400 && error.response?.status < 500) {
                throw error;
            }

            // Wait with exponential backoff
            if (attempt < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError;
};

export default useApi;
