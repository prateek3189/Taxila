# To Do App - Frontend

A beautiful and functional To Do application built with vanilla HTML, CSS, and JavaScript, connected to an Express backend API.

## Features

- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Delete individual tasks
- ✅ Filter tasks (All, Active, Completed)
- ✅ Clear all completed tasks
- ✅ Backend API integration (Express server)
- ✅ Error handling and loading states
- ✅ Responsive design (works on mobile and desktop)
- ✅ Modern, gradient UI design
- ✅ Smooth animations and transitions

## Getting Started

### Prerequisites

1. **Start the Backend Server** (required):
   ```bash
   cd ../backend
   npm install
   npm start
   ```
   The backend will run on `http://localhost:3000`

2. **Start the Frontend**:

   **Option 1: Use a Local Server (Recommended)**
   
   For the best experience, use a local server:
   
   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Using Node.js (http-server):**
   ```bash
   npx http-server -p 8000
   ```
   
   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```
   
   Then open `http://localhost:8000` in your browser.

   **Option 2: Open Directly in Browser**
   
   You can also open `index.html` directly, but make sure the backend server is running first.

## Project Structure

```
frontend/
├── index.html      # Main HTML structure
├── styles.css      # All styling
├── script.js       # Application logic
└── README.md       # This file
```

## How to Use

1. **Add a Task**: Type in the input field and click "Add" or press Enter
2. **Complete a Task**: Click the checkbox next to a task
3. **Delete a Task**: Click the × button on the right side of a task
4. **Filter Tasks**: Use the filter buttons (All, Active, Completed) at the top
5. **Clear Completed**: Click "Clear Completed" button to remove all completed tasks

## Backend Connection

The frontend connects to the Express backend API running on `http://localhost:3000`. 

### API Configuration

The API base URL is configured in `script.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

To change the backend URL, update this constant in `script.js`.

### Data Persistence

All tasks are saved to the backend server (stored in `backend/data/todos.json`). The data persists on the server, not in the browser's local storage.

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with modern features (gradients, animations, flexbox)
- **Vanilla JavaScript** - No frameworks or libraries required

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Customization

You can easily customize the app by modifying:
- **Colors**: Edit the gradient colors in `styles.css` (lines with `#667eea` and `#764ba2`)
- **Fonts**: Change the font-family in `styles.css`
- **Layout**: Adjust padding, margins, and sizes in `styles.css`

