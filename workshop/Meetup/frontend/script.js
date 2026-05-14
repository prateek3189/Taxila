// Import API interceptor
import apiInterceptor from './js/interceptor.js';

// State management
let todos = [];
let currentFilter = 'all';
let isLoading = false;

// DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');

// Initialize app
async function init() {
    setupEventListeners();
    await loadTodos();
}

// API Helper Functions - Using interceptor
async function apiRequest(endpoint, options = {}) {
    try {
        return await apiInterceptor.request(endpoint, options);
    } catch (error) {
        console.error('API Error:', error);
        showError(error.message || 'Failed to connect to server');
        throw error;
    }
}

// Load todos from API
async function loadTodos() {
    try {
        setLoading(true);
        todos = await apiRequest('/todos');
        renderTodos();
    } catch (error) {
        console.error('Failed to load todos:', error);
        todos = [];
        renderTodos();
    } finally {
        setLoading(false);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add todo
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    // Clear completed
    clearCompletedBtn.addEventListener('click', clearCompleted);
}

// Add new todo
async function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        todoInput.focus();
        return;
    }

    if (isLoading) return;

    try {
        setLoading(true);
        const newTodo = await apiRequest('/todos', {
            method: 'POST',
            body: JSON.stringify({ text })
        });

        todos.push(newTodo);
        todoInput.value = '';
        todoInput.focus();
        renderTodos();
    } catch (error) {
        console.error('Failed to add todo:', error);
    } finally {
        setLoading(false);
    }
}

// Toggle todo completion
async function toggleTodo(id) {
    if (isLoading) return;

    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const newCompletedState = !todo.completed;

    try {
        setLoading(true);
        const updatedTodo = await apiRequest(`/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ completed: newCompletedState })
        });

        todos = todos.map(t => t.id === id ? updatedTodo : t);
        renderTodos();
    } catch (error) {
        console.error('Failed to toggle todo:', error);
        // Revert on error
        renderTodos();
    } finally {
        setLoading(false);
    }
}

// Delete todo
async function deleteTodo(id) {
    if (isLoading) return;

    try {
        setLoading(true);
        await apiRequest(`/todos/${id}`, {
            method: 'DELETE'
        });

        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
    } catch (error) {
        console.error('Failed to delete todo:', error);
    } finally {
        setLoading(false);
    }
}

// Clear all completed todos
async function clearCompleted() {
    if (isLoading) return;

    try {
        setLoading(true);
        await apiRequest('/todos', {
            method: 'DELETE'
        });

        todos = todos.filter(todo => !todo.completed);
        renderTodos();
    } catch (error) {
        console.error('Failed to clear completed todos:', error);
    } finally {
        setLoading(false);
    }
}

// Filter todos based on current filter
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// Render todos to the DOM
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    const activeCount = todos.filter(t => !t.completed).length;
    const completedCount = todos.filter(t => t.completed).length;

    // Update task count
    taskCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`;

    // Show/hide clear completed button
    if (completedCount > 0) {
        clearCompletedBtn.style.display = 'block';
    } else {
        clearCompletedBtn.style.display = 'none';
    }

    // Render todo list
    if (filteredTodos.length === 0) {
        let message = '';
        if (todos.length === 0) {
            message = 'No tasks yet. Add one above! ✨';
        } else if (currentFilter === 'active') {
            message = 'No active tasks! 🎉';
        } else if (currentFilter === 'completed') {
            message = 'No completed tasks yet.';
        }
        todoList.innerHTML = `<p class="empty-message">${message}</p>`;
    } else {
        todoList.innerHTML = filteredTodos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})" title="Delete">
                    ×
                </button>
            </div>
        `).join('');
    }
}

// Loading state management
function setLoading(loading) {
    isLoading = loading;
    addBtn.disabled = loading;
    todoInput.disabled = loading;
    
    if (loading) {
        addBtn.style.opacity = '0.6';
        addBtn.style.cursor = 'not-allowed';
    } else {
        addBtn.style.opacity = '1';
        addBtn.style.cursor = 'pointer';
    }
}

// Show error message
function showError(message) {
    // Create or update error message element
    let errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errorMessage';
        errorDiv.style.cssText = `
            background: #ff6b6b;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
            animation: slideIn 0.3s ease;
        `;
        const container = document.querySelector('.todo-container');
        container.insertBefore(errorDiv, container.firstChild);
    }
    
    errorDiv.textContent = `Error: ${message}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorDiv) {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (errorDiv && errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 300);
        }
    }, 5000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions available globally for inline event handlers
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

