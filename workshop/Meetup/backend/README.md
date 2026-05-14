# To Do App - Express Backend

A RESTful API backend for a To Do application built with Express.js, supporting full CRUD operations.

## Features

- ✅ Create new todos
- ✅ Read all todos or a single todo by ID
- ✅ Update todo text and completion status
- ✅ Delete individual todos
- ✅ Delete all completed todos
- ✅ Persistent storage using JSON file
- ✅ CORS enabled for frontend integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

You can change the port by setting the `PORT` environment variable:
```bash
PORT=5000 npm start
```

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Get All Todos
```http
GET /api/todos
```

**Response:**
```json
[
  {
    "id": 1234567890,
    "text": "Buy groceries",
    "completed": false,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
]
```

#### 2. Get Single Todo
```http
GET /api/todos/:id
```

**Response:**
```json
{
  "id": 1234567890,
  "text": "Buy groceries",
  "completed": false,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

#### 3. Create Todo
```http
POST /api/todos
Content-Type: application/json

{
  "text": "Buy groceries"
}
```

**Response:**
```json
{
  "id": 1234567890,
  "text": "Buy groceries",
  "completed": false,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

#### 4. Update Todo
```http
PUT /api/todos/:id
Content-Type: application/json

{
  "text": "Buy groceries and milk",
  "completed": true
}
```

**Response:**
```json
{
  "id": 1234567890,
  "text": "Buy groceries and milk",
  "completed": true,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T13:00:00.000Z"
}
```

#### 5. Delete Todo
```http
DELETE /api/todos/:id
```

**Response:** `204 No Content`

#### 6. Delete All Completed Todos
```http
DELETE /api/todos
```

**Response:**
```json
{
  "message": "Completed todos deleted",
  "count": 3
}
```

#### 7. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Data Storage

Todos are stored in `data/todos.json`. The file is automatically created on first run.

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message"
}
```

## Example Usage with cURL

```bash
# Get all todos
curl http://localhost:3000/api/todos

# Create a todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn Express"}'

# Update a todo
curl -X PUT http://localhost:3000/api/todos/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete a todo
curl -X DELETE http://localhost:3000/api/todos/1234567890
```

## Technologies

- **Express.js** - Web framework
- **CORS** - Cross-Origin Resource Sharing
- **Node.js File System** - Data persistence

## Project Structure

```
Meetup/
├── data/
│   ├── todos.js      # Data access layer
│   └── todos.json    # JSON storage file
├── server.js         # Main server file
├── package.json      # Dependencies
└── README.md         # Documentation
```

