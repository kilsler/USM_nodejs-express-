let todos = [
    { id: 1, title: "Купить молоко", completed: false },
    { id: 2, title: "Сделать лабораторную", completed: true },
];

export function getAll(status = 'all') {
    if (status === 'active') {
        return todos.filter(t => !t.completed);
    } else if (status === 'completed') {
        return todos.filter(t => t.completed);
    }
    return todos;
}

export function add(title) {
    const newTodo = { id: Date.now(), title, completed: false };
    todos.push(newTodo);
}

export function toggle(id) {
    todos = todos.map(t =>
        t.id === Number(id) ? { ...t, completed: !t.completed } : t
    );
}

export function remove(id) {
    todos = todos.filter(t => t.id !== Number(id));
}

