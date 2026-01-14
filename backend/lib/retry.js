export const retryWithBackoff = async (fn, options = {}) => {
    const {
        maxRetries = 3,
        initialDelay = 1000,      
        maxDelay = 30000,         
        shouldRetry = () => true, 
        onRetry = null            
    } = options;

    let lastError;
    let delay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const result = await fn();
            return result;
        } catch (error) {
            lastError = error;

            if (attempt === maxRetries) {
                console.error(`All ${maxRetries} retry attempts failed:`, error.message);
                throw error;
            }

            if (!shouldRetry(error)) {
                console.error(` Error not retryable:`, error.message);
                throw error;
            }

            const backoffDelay = Math.min(delay * Math.pow(2, attempt), maxDelay);

            const jitter = Math.random() * 0.3 * backoffDelay;
            const finalDelay = backoffDelay + jitter;

            console.warn(`Attempt ${attempt + 1}/${maxRetries} failed: ${error.message}`);
            console.warn(`   Retrying in ${Math.round(finalDelay)}ms...`);

            // Callback để log hoặc metrics
            if (onRetry) {
                onRetry(attempt + 1, error, finalDelay);
            }

            // Chờ trước khi retry
            await sleep(finalDelay);
        }
    }

    throw lastError;
};

export const retryHttpRequest = async (requestFn, options = {}) => {
    return retryWithBackoff(requestFn, {
        maxRetries: options.maxRetries || 3,
        initialDelay: options.initialDelay || 1000,
        
        // Chỉ retry với các lỗi network hoặc 5xx server errors
        shouldRetry: (error) => {
            if (error.code === 'ECONNRESET' || 
                error.code === 'ETIMEDOUT' || 
                error.code === 'ECONNREFUSED') {
                return true;
            }

            if (error.response && error.response.status >= 500) {
                return true;
            }

            if (error.response && error.response.status === 429) {
                return true;
            }

            if (error.response && error.response.status >= 400 && error.response.status < 500) {
                return false;
            }

            return true;
        },

        onRetry: options.onRetry
    });
};

export const retryDatabaseOperation = async (dbFn, options = {}) => {
    return retryWithBackoff(dbFn, {
        maxRetries: options.maxRetries || 2,
        initialDelay: 500,  
        
        shouldRetry: (error) => {
            const transientErrors = [
                'ECONNRESET',
                'ETIMEDOUT', 
                'MongoNetworkError',
                'MongoTimeoutError'
            ];

            return transientErrors.some(errType => 
                error.message.includes(errType) || 
                error.name === errType
            );
        },

        onRetry: options.onRetry
    });
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const withRetry = (fn, options = {}) => {
    return async (...args) => {
        return retryWithBackoff(() => fn(...args), options);
    };
};

export default {
    retryWithBackoff,
    retryHttpRequest,
    retryDatabaseOperation,
    withRetry
};
