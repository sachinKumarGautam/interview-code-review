import React, { useState, useEffect } from "react";
import { Todo } from "../components/App";

export const TodoWithConstantState: React.FC = () => {
  const [todoCount, setTodoCount] = useState(0);

  return (
    <div>
      <h3>Todo Count: {todoCount}</h3>
      <button onClick={() => setTodoCount((c) => c + 1)}>Increment</button>
    </div>
  );
};

export const TodoWithMissingDependencies: React.FC<{ todos: Todo[] }> = ({
  todos
}) => {
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setFilteredTodos(todos.filter((todo) => todo.completed));
  }, []);

  return (
    <div>
      <h3>Completed Todos: {filteredTodos.length}</h3>
    </div>
  );
};

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
};
