import React from "react";
import { Todo } from "./App";

interface TodoListProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const TodoList: React.FC<TodoListProps> = ({ todos, setTodos }) => {
  const completedCount = todos.reduce(
    (acc, todo) => acc + (todo.completed ? 1 : 0),
    0
  );

  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed
                ? new Date().toISOString()
                : undefined
            }
          : todo
      )
    );
  };

  return (
    <div style={{ padding: "20px", margin: "10px", border: "1px solid #ccc" }}>
      <h2>Todo Items ({completedCount} completed)</h2>
      {todos.map((todo) => (
        <div
          key={todo.id}
          style={{
            padding: "10px",
            backgroundColor: todo.completed ? "#e0e0e0" : "white",
            cursor: "pointer",
            marginBottom: "5px",
            border: "1px solid #ddd",
            borderRadius: "4px"
          }}
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span
            style={{
              marginLeft: "10px",
              textDecoration: todo.completed ? "line-through" : "none"
            }}
          >
            {todo.text}
          </span>
          {todo.category && (
            <span
              style={{
                marginLeft: "10px",
                padding: "2px 6px",
                backgroundColor: "#f0f0f0",
                borderRadius: "3px",
                fontSize: "12px"
              }}
            >
              {todo.category}
            </span>
          )}
        </div>
      ))}
      {todos.length === 0 && (
        <p style={{ fontStyle: "italic", color: "#666" }}>
          No todos yet. Add one above!
        </p>
      )}
    </div>
  );
};

export default TodoList;
