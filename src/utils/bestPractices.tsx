import React, { useState, useEffect } from "react";
import { Todo } from "../components/App";

// Issue: Component with state that should be props
export const TodoWithConstantState: React.FC = () => {
  // Issue: State that should be props
  const [todoCount, setTodoCount] = useState(0);

  return (
    <div>
      <h3>Todo Count: {todoCount}</h3>
      <button onClick={() => setTodoCount((c) => c + 1)}>Increment</button>
    </div>
  );
};

// Issue: Missing dependencies in useEffect
export const TodoWithMissingDependencies: React.FC<{ todos: Todo[] }> = ({
  todos
}) => {
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  // Issue: Missing 'todos' in dependencies array
  useEffect(() => {
    setFilteredTodos(todos.filter((todo) => todo.completed));
  }, []); // Should include 'todos'

  return (
    <div>
      <h3>Completed Todos: {filteredTodos.length}</h3>
    </div>
  );
};

// Issue: Promise chain without proper error handling
export const fetchTodosChainedPromises = () => {
  fetch("/api/todos")
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("todos", JSON.stringify(data));
      return fetch("/api/stats");
    })
    .then((response) => response.json())
    .then((stats) => {
      console.log(stats);
    });
  // Missing .catch() block
};
