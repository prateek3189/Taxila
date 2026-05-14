// Frontend API Interceptor
// Wraps fetch API to add request/response interceptors

class ApiInterceptor {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.requestInterceptors = [];
        this.responseInterceptors = [];
        this.errorInterceptors = [];
    }

    // Add request interceptor
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }

    // Add response interceptor
    addResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }

    // Add error interceptor
    addErrorInterceptor(interceptor) {
        this.errorInterceptors.push(interceptor);
    }

    // Execute request interceptors
    async executeRequestInterceptors(config) {
        let modifiedConfig = { ...config };
        
        for (const interceptor of this.requestInterceptors) {
            modifiedConfig = await interceptor(modifiedConfig) || modifiedConfig;
        }
        
        return modifiedConfig;
    }

    // Execute response interceptors
    async executeResponseInterceptors(response, config) {
        let modifiedResponse = response;
        
        for (const interceptor of this.responseInterceptors) {
            modifiedResponse = await interceptor(modifiedResponse, config) || modifiedResponse;
        }
        
        return modifiedResponse;
    }

    // Execute error interceptors
    async executeErrorInterceptors(error, config) {
        let modifiedError = error;
        
        for (const interceptor of this.errorInterceptors) {
            modifiedError = await interceptor(modifiedError, config) || modifiedError;
        }
        
        return modifiedError;
    }

    // Main fetch wrapper
    async request(endpoint, options = {}) {
        const config = {
            url: `${this.baseURL}${endpoint}`,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
            startTime: Date.now(), // Track request start time
            ...options
        };

        try {
            // Execute request interceptors
            const modifiedConfig = await this.executeRequestInterceptors(config);
            
            // Make the actual fetch request
            const response = await fetch(modifiedConfig.url, {
                method: modifiedConfig.method,
                headers: modifiedConfig.headers,
                body: modifiedConfig.body
            });

            // Execute response interceptors
            const modifiedResponse = await this.executeResponseInterceptors(response, modifiedConfig);

            // Handle errors
            if (!modifiedResponse.ok) {
                const errorData = await modifiedResponse.json().catch(() => ({ 
                    error: `HTTP error! status: ${modifiedResponse.status}` 
                }));
                const error = new Error(errorData.error || `HTTP error! status: ${modifiedResponse.status}`);
                error.status = modifiedResponse.status;
                error.data = errorData;
                
                // Execute error interceptors
                throw await this.executeErrorInterceptors(error, modifiedConfig);
            }

            // Handle 204 No Content
            if (modifiedResponse.status === 204) {
                return null;
            }

            return await modifiedResponse.json();
        } catch (error) {
            // Execute error interceptors
            const finalError = await this.executeErrorInterceptors(error, config);
            throw finalError;
        }
    }
}

// Create interceptor instance
const apiInterceptor = new ApiInterceptor('http://localhost:3000/api');

// Add default request interceptor - Logging
apiInterceptor.addRequestInterceptor((config) => {
    console.log(`[API Request] ${config.method} ${config.url}`);
    if (config.body) {
        console.log('[API Request Body]', config.body);
    }
    return config;
});

// Add default request interceptor - Add timestamp
apiInterceptor.addRequestInterceptor((config) => {
    config.headers['X-Request-Time'] = new Date().toISOString();
    return config;
});

// Add default response interceptor - Logging
apiInterceptor.addResponseInterceptor((response, config) => {
    const requestId = response.headers.get('X-Request-ID');
    const responseTime = response.headers.get('X-Response-Time');
    
    console.log(`[API Response] ${config.method} ${config.url} - ${response.status}`);
    if (requestId) console.log(`[Request ID] ${requestId}`);
    if (responseTime) console.log(`[Response Time] ${responseTime}`);
    
    return response;
});

// Add default response interceptor - Timing
apiInterceptor.addResponseInterceptor(async (response, config) => {
    const startTime = config.startTime || Date.now();
    const duration = Date.now() - startTime;
    console.log(`[API Timing] ${config.method} ${config.url} took ${duration}ms`);
    return response;
});

// Add default error interceptor - Error handling
apiInterceptor.addErrorInterceptor((error, config) => {
    console.error(`[API Error] ${config.method} ${config.url}`, error);
    
    // You can add custom error handling here
    // For example, retry logic, error reporting, etc.
    
    return error;
});

// Export the interceptor instance
export default apiInterceptor;

