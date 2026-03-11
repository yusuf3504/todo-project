import TodoItem from "./TodoItem";

export default function TodoList({ todos, onUpdate, onDelete, onToggle }) {
  if (!todos.length) {
    return (
      <p className="text-gray-500">
        Henüz görev yok. Üstten ekleyin.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem
            todo={todo}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        </li>
      ))}
    </ul>
  );
}