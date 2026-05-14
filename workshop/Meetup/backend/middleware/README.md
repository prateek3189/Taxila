# Backend Interceptors

This directory contains middleware interceptors for the Express backend server.

## Interceptors

### 1. Request Interceptor (`requestInterceptor`)
- **Purpose**: Logs incoming requests and adds custom headers
- **Features**:
  - Logs request method, path, timestamp
  - Logs request body for POST/PUT requests
  - Logs query and route parameters
  - Adds `X-Request-ID` header
  - Adds `X-Timestamp` header
  - Measures and logs response time
  - Logs response data in development mode

### 2. Validation Interceptor (`validationInterceptor`)
- **Purpose**: Validates request format
- **Features**:
  - Validates Content-Type header for POST/PUT requests
  - Returns 400 error if Content-Type is not `application/json`

### 3. Rate Limit Interceptor (`rateLimitInterceptor`)
- **Purpose**: Prevents API abuse
- **Features**:
  - Limits requests to 100 per minute per IP address
  - Returns 429 (Too Many Requests) if limit exceeded
  - Includes `retryAfter` in error response

### 4. Error Interceptor (`errorInterceptor`)
- **Purpose**: Global error handling
- **Features**:
  - Catches all unhandled errors
  - Logs error details with stack trace
  - Returns standardized error response
  - Includes error details in development mode

## Usage

Interceptors are automatically applied in `server.js`:

```javascript
app.use(requestInterceptor);        // Log requests and responses
app.use(validationInterceptor);     // Validate request format
app.use(rateLimitInterceptor);      // Rate limiting
// ... routes ...
app.use(errorInterceptor);          // Error handling (must be last)
```

## Configuration

### Rate Limiting
Edit `rateLimitInterceptor` in `interceptor.js`:
- `RATE_LIMIT`: Maximum requests per window (default: 100)
- `RATE_LIMIT_WINDOW`: Time window in milliseconds (default: 60000 = 1 minute)

### Logging
Set `NODE_ENV=development` to enable detailed response logging.

## Example Log Output

```
[2024-01-01T12:00:00.000Z] GET /api/todos
[2024-01-01T12:00:00.100Z] GET /api/todos - 200 (100ms)
Response Data: [...]
```

