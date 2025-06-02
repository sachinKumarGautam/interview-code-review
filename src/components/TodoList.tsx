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
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      setTodos([...todos]);
    }
  };

  return (
    <div style={{ padding: "20px", margin: "10px", border: "1px solid #ccc" }}>
      <h2>Todo Items ({completedCount} completed)</h2>
      {todos.map((todo) => (
        <div
          style={{
            padding: "10px",
            backgroundColor: todo.completed ? "#e0e0e0" : "white",
            cursor: "pointer"
          }}
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span style={{ marginLeft: "10px" }}>{todo.text}</span>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
