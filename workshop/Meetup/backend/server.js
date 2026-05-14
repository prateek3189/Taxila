import express from "express";
import cors from "cors";
import { readTodos, writeTodos } from "./data/todos.js";
import {
  requestInterceptor,
  errorInterceptor,
  validationInterceptor,
  rateLimitInterceptor,
} from "./middleware/interceptor.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Custom interceptors (order matters!)
app.use(requestInterceptor); // Log requests and responses
app.use(validationInterceptor); // Validate request format
app.use(rateLimitInterceptor); // Rate limiting

// Routes

// GET /api/todos - Get all todos
app.get("/api/todos", (req, res) => {
  try {
    const todos = readTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// GET /api/todos/:id - Get a single todo by ID
app.get("/api/todos/:id", (req, res) => {
  try {
    const todos = readTodos();
    const todo = todos.find((t) => t.id === parseInt(req.params.id));

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

// POST /api/todos - Create a new todo
app.post("/api/todos", (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Text is required" });
    }

    const todos = readTodos();
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    writeTodos(todos);

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// PUT /api/todos/:id - Update a todo
app.put("/api/todos/:id", (req, res) => {
  try {
    const { text, completed } = req.body;
    const todos = readTodos();
    const todoIndex = todos.findIndex((t) => t.id === parseInt(req.params.id));

    if (todoIndex === -1) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const todo = todos[todoIndex];

    // Update fields if provided
    if (text !== undefined) {
      todo.text = text.trim();
    }
    if (completed !== undefined) {
      todo.completed = Boolean(completed);
    }
    todo.updatedAt = new Date().toISOString();

    writeTodos(todos);
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// DELETE /api/todos/:id - Delete a todo
app.delete("/api/todos/:id", (req, res) => {
  try {
    const todos = readTodos();
    const todoIndex = todos.findIndex((t) => t.id === parseInt(req.params.id));

    if (todoIndex === -1) {
      return res.status(404).json({ error: "Todo not found" });
    }

    todos.splice(todoIndex, 1);
    writeTodos(todos);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// DELETE /api/todos - Delete all completed todos
app.delete("/api/todos", (req, res) => {
  try {
    const todos = readTodos();
    const filteredTodos = todos.filter((t) => !t.completed);
    writeTodos(filteredTodos);

    res.json({
      message: "Completed todos deleted",
      count: todos.length - filteredTodos.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete completed todos" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware (must be last)
app.use(errorInterceptor);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    "Interceptors enabled: Request logging, Validation, Rate limiting"
  );
});
