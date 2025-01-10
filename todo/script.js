// Load todos from sessionStorage
const loadTodos = () => {
    const todos = JSON.parse(sessionStorage.getItem('todos')) || [];
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        const todoSpan = document.createElement('span');
        todoSpan.className = 'todo-text';
        todoSpan.textContent = todo;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '✖';
        deleteButton.className = 'delete';
        deleteButton.onclick = () => deleteTodo(index);

        li.appendChild(todoSpan);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
        
        // Make each todo editable on click.
        li.addEventListener('click', () => {
            startEditing(todoSpan, index);
            todoSpan.focus(); // Focus on the span to make it editable immediately
        });
    });
};

// Start editing a todo
const startEditing = (span, index) => {
    span.contentEditable = true;
    span.parentElement.classList.add('editing');

    const finishEditing = () => {
        span.contentEditable = false;
        span.parentElement.classList.remove('editing');
        const newText = span.textContent.trim();
        if (newText) {
            const todos = JSON.parse(sessionStorage.getItem('todos')) || [];
            todos[index] = newText;
            sessionStorage.setItem('todos', JSON.stringify(todos));
        }
        loadTodos();
    };

    span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            finishEditing();
        }
    });
    span.addEventListener('blur', finishEditing);
};

// Add a new todo
const addTodo = () => {
    const todoInput = document.querySelector('input');
    const todoText = todoInput.value.trim();
    if (todoText) {
        const todos = JSON.parse(sessionStorage.getItem('todos')) || [];
        todos.push(todoText);
        sessionStorage.setItem('todos', JSON.stringify(todos));
        todoInput.value = '';
        loadTodos();
    }
};

// Delete a todo
const deleteTodo = (index) => {
    const todos = JSON.parse(sessionStorage.getItem('todos')) || [];
    todos.splice(index, 1);
    sessionStorage.setItem('todos', JSON.stringify(todos));
    loadTodos();
};

// Handle keypress events
document.addEventListener('keydown', (event) => {
    const todoInput = document.querySelector('input');
    const activeElement = document.activeElement;

    if (activeElement === todoInput) {
        if (event.key === 'Enter') {
            addTodo();
        }
        return;
    }

    if (activeElement.classList.contains('todo-text')) {
        return; // Let normal editing behavior happen
    }

    if (event.key === 'Backspace') {
        const selectedTodo = document.querySelector('li:hover');
        if (selectedTodo) {
            event.preventDefault();
            const index = Array.from(document.getElementById('todoList').children).indexOf(selectedTodo);
            deleteTodo(index);
        }
    }
});

// Add a mouseleave event listener to the input field
const todoInput = document.querySelector('input');
todoInput.addEventListener('mouseleave', () => {
    todoInput.blur(); // Remove focus from the input field
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadTodos(); // Load todos from sessionStorage
}); 