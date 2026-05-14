// Request/Response Interceptor Middleware

// Request interceptor - runs before route handlers
export const requestInterceptor = (req, res, next) => {
  // Log incoming request
  const startTime = Date.now();
  req.startTime = startTime;
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Log request body for POST/PUT requests
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  
  // Log query parameters
  if (Object.keys(req.query).length > 0) {
    console.log('Query Params:', req.query);
  }
  
  // Log route parameters
  if (Object.keys(req.params).length > 0) {
    console.log('Route Params:', req.params);
  }
  
  // Add custom headers
  res.setHeader('X-Request-ID', generateRequestId());
  res.setHeader('X-Timestamp', new Date().toISOString());
  
  // Store original json method to intercept response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    // Log response
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Response Data:', JSON.stringify(data, null, 2));
    }
    
    // Call original json method
    return originalJson.call(this, data);
  };
  
  // Store original send method for 204 responses
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Error interceptor - handles errors globally
export const errorInterceptor = (err, req, res, next) => {
  const duration = req.startTime ? Date.now() - req.startTime : 0;
  
  console.error(`[${new Date().toISOString()}] ERROR ${req.method} ${req.path} - ${err.message}`);
  console.error('Error Stack:', err.stack);
  
  // Determine status code
  const statusCode = err.statusCode || err.status || 500;
  
  // Send error response
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Validation interceptor - validates request data
export const validationInterceptor = (req, res, next) => {
  // Validate Content-Type for POST/PUT requests
  if ((req.method === 'POST' || req.method === 'PUT') && req.path.startsWith('/api')) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: 'Content-Type must be application/json'
      });
    }
  }
  
  next();
};

// Rate limiting interceptor (simple in-memory implementation)
const requestCounts = new Map();
const RATE_LIMIT = 100; // requests per minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute

export const rateLimitInterceptor = (req, res, next) => {
  const clientId = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(clientId)) {
    requestCounts.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }
  
  const clientData = requestCounts.get(clientId);
  
  // Reset if window expired
  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
    return next();
  }
  
  // Check rate limit
  if (clientData.count >= RATE_LIMIT) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  }
  
  clientData.count++;
  next();
};

// Helper function to generate unique request ID
function generateRequestId() {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

