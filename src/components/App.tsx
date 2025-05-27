import React, { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import { unsafeRenderTodo } from "./utils/security";
import { ExpensiveTodoStats } from "./utils/performance";
import {
  TodoWithConstantState,
  TodoWithMissingDependencies,
  fetchTodosChainedPromises
} from "./utils/bestPractices";
import ErrorBoundary from "./components/ErrorBoundary";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    fetchTodosWithoutErrorHandling();
    fetchTodosChainedPromises();
  }, []);

  const addTodo = (text: string) => {
    todos.push({ id: Date.now(), text, completed: false });
    setTodos(todos);
  };

  const stats = {
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    timestamp: new Date().toISOString()
  };

  return (
    <div className="todo-app">
      <h1>Todo List App</h1>
      <ErrorBoundary>
        <TodoForm onSubmit={addTodo} />
        {showCompleted && <TodoList todos={todos} setTodos={setTodos} />}
        {unsafeRenderTodo(todos[0]?.text)}
        <ExpensiveTodoStats todos={todos} />
        <TodoWithConstantState />
        <TodoWithMissingDependencies todos={todos} />
        <button onClick={() => setShowCompleted((prev) => !prev)}>
          Toggle Completed
        </button>
      </ErrorBoundary>
    </div>
  );
}

export default App;
