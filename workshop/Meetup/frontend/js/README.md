# Frontend API Interceptor

A flexible interceptor system for intercepting and modifying API requests and responses.

## Features

- **Request Interceptors**: Modify requests before they're sent
- **Response Interceptors**: Process responses before they're returned
- **Error Interceptors**: Handle errors globally
- **Automatic Logging**: Logs all API requests and responses
- **Timing Information**: Tracks request/response duration
- **Custom Headers**: Automatically adds request timestamps

## Default Interceptors

### Request Interceptors
1. **Logging**: Logs request method, URL, and body
2. **Timestamp**: Adds `X-Request-Time` header

### Response Interceptors
1. **Logging**: Logs response status, request ID, and response time
2. **Timing**: Calculates and logs request duration

### Error Interceptors
1. **Error Handling**: Logs errors with full details

## Usage

The interceptor is automatically used by `apiRequest()` function in `script.js`:

```javascript
// All API calls automatically go through interceptors
await apiRequest('/todos', { method: 'GET' });
await apiRequest('/todos', { method: 'POST', body: { text: 'New task' } });
```

## Adding Custom Interceptors

You can add custom interceptors in `script.js`:

```javascript
// Add custom request interceptor
apiInterceptor.addRequestInterceptor((config) => {
    // Add authentication token
    config.headers['Authorization'] = 'Bearer ' + getAuthToken();
    return config;
});

// Add custom response interceptor
apiInterceptor.addResponseInterceptor((response, config) => {
    // Process response data
    console.log('Custom processing:', response);
    return response;
});

// Add custom error interceptor
apiInterceptor.addErrorInterceptor((error, config) => {
    // Handle specific errors
    if (error.status === 401) {
        // Redirect to login
        window.location.href = '/login';
    }
    return error;
});
```

## Interceptor Function Signatures

### Request Interceptor
```javascript
function requestInterceptor(config) {
    // config.url, config.method, config.headers, config.body
    // Return modified config or undefined
    return config;
}
```

### Response Interceptor
```javascript
async function responseInterceptor(response, config) {
    // response: Fetch Response object
    // config: Original request config
    // Return modified response or undefined
    return response;
}
```

### Error Interceptor
```javascript
async function errorInterceptor(error, config) {
    // error: Error object
    // config: Original request config
    // Return modified error or undefined
    return error;
}
```

## Example Console Output

```
[API Request] GET http://localhost:3000/api/todos
[API Response] GET http://localhost:3000/api/todos - 200
[Request ID] req-1234567890-abc123
[Response Time] 45ms
[API Timing] GET http://localhost:3000/api/todos took 45ms
```

