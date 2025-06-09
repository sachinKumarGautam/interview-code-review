import React, { useState, useEffect } from "react";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import { renderUserContent } from "../utils/htmlRenderer";
import { TodoAnalytics } from "../utils/todoStats";
import {
  TodoCounter,
  CompletedTodoFilter,
  syncTodoData
} from "../utils/todoHelpers";
import ErrorBoundary from "./ErrorBoundary";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt?: string;
  completedAt?: string;
  category?: string;
  priority?: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Sync todo data from server
        const syncResult = await syncTodoData();
        if (syncResult.todos && Array.isArray(syncResult.todos)) {
          setTodos(syncResult.todos);
        }
      } catch (error) {
        console.error("Failed to initialize app:", error);
        // Set some demo data for development
        setTodos([
          {
            id: 1,
            text: "Learn React",
            completed: false,
            createdAt: new Date().toISOString(),
            category: "development",
            priority: "high"
          },
          {
            id: 2,
            text: "Build Todo App",
            completed: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            completedAt: new Date().toISOString(),
            category: "development",
            priority: "medium"
          }
        ]);
      }
    };

    initializeApp();
  }, []);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      category: "general",
      priority: "medium"
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
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

        <div className="app-stats">
          <TodoCounter
            initialCount={stats.total}
            onCountChange={(count) => console.log("Todo count:", count)}
          />
        </div>

        {showCompleted && <TodoList todos={todos} setTodos={setTodos} />}

        <div className="todo-content">
          {renderUserContent(todos[0]?.text, {
            enableMarkdown: true,
            maxLength: 500
          })}
        </div>

        <TodoAnalytics
          todos={todos}
          enableDetailedAnalytics={true}
          refreshInterval={60000}
        />

        <CompletedTodoFilter todos={todos} showOnlyCompleted={showCompleted} />

        <div className="app-controls">
          <button
            onClick={() => setShowCompleted((prev) => !prev)}
            className="btn btn-secondary"
          >
            {showCompleted ? "Hide" : "Show"} Completed Todos
          </button>
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
