// useRequest Hook - Centralized API request handling with loading/error states
import { useState, useCallback } from 'react';

// Request states
export const REQUEST_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
};

// Main useRequest hook
export const useRequest = (requestFn, options = {}) => {
    const {
        onSuccess,
        onError,
        initialData = null,
        autoReset = false,
        resetDelay = 3000,
    } = options;

    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(REQUEST_STATUS.IDLE);

    const isLoading = status === REQUEST_STATUS.LOADING;
    const isSuccess = status === REQUEST_STATUS.SUCCESS;
    const isError = status === REQUEST_STATUS.ERROR;
    const isIdle = status === REQUEST_STATUS.IDLE;

    const reset = useCallback(() => {
        setData(initialData);
        setError(null);
        setStatus(REQUEST_STATUS.IDLE);
    }, [initialData]);

    const execute = useCallback(async (...args) => {
        try {
            setStatus(REQUEST_STATUS.LOADING);
            setError(null);

            const result = await requestFn(...args);
            
            setData(result);
            setStatus(REQUEST_STATUS.SUCCESS);
            
            if (onSuccess) {
                onSuccess(result);
            }

            if (autoReset) {
                setTimeout(reset, resetDelay);
            }

            return { success: true, data: result };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
            
            setError(errorMessage);
            setStatus(REQUEST_STATUS.ERROR);
            
            if (onError) {
                onError(err);
            }

            console.error('useRequest error:', err);

            return { success: false, error: errorMessage };
        }
    }, [requestFn, onSuccess, onError, autoReset, resetDelay, reset]);

    return {
        data,
        error,
        status,
        isLoading,
        isSuccess,
        isError,
        isIdle,
        execute,
        reset,
    };
};

// Simplified hook for immediate execution
export const useFetch = (requestFn, dependencies = []) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await requestFn();
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [requestFn]);

    // Initial fetch
    useState(() => {
        refetch();
    });

    return { data, error, loading, refetch };
};

// Hook for mutation operations (create, update, delete)
export const useMutation = (mutationFn, options = {}) => {
    const { onSuccess, onError } = options;
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const mutate = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await mutationFn(...args);
            
            if (onSuccess) {
                onSuccess(result);
            }
            
            return { success: true, data: result };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
            setError(errorMessage);
            
            if (onError) {
                onError(err);
            }
            
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [mutationFn, onSuccess, onError]);

    const reset = useCallback(() => {
        setError(null);
    }, []);

    return { mutate, loading, error, reset };
};

export default useRequest;
