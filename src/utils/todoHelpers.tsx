import React, { useState, useEffect, useCallback } from "react";
import { Todo } from "../components/App";

interface TodoCounterProps {
  onCountChange?: (count: number) => void;
  initialCount?: number;
}

export const TodoCounter: React.FC<TodoCounterProps> = ({
  onCountChange,
  initialCount = 0
}) => {
  const [todoCount, setTodoCount] = useState(initialCount);

  const handleIncrement = useCallback(() => {
    const newCount = todoCount + 1;
    setTodoCount(newCount);
    if (onCountChange) {
      onCountChange(newCount);
    }
  }, [todoCount, onCountChange]);

  return (
    <div className="todo-counter">
      <h3>Active Todos: {todoCount}</h3>
      <button
        onClick={handleIncrement}
        className="btn btn-primary"
        aria-label="Add new todo"
      >
        Add Todo
      </button>
    </div>
  );
};

interface CompletedTodoFilterProps {
  todos: Todo[];
  showOnlyCompleted?: boolean;
}

export const CompletedTodoFilter: React.FC<CompletedTodoFilterProps> = ({
  todos,
  showOnlyCompleted = true
}) => {
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const filtered = showOnlyCompleted
      ? todos.filter((todo) => todo.completed)
      : todos.filter((todo) => !todo.completed);
    setFilteredTodos(filtered);
  }, [todos, showOnlyCompleted]);

  const completionRate =
    todos.length > 0
      ? Math.round((filteredTodos.length / todos.length) * 100)
      : 0;

  return (
    <div className="todo-filter-stats">
      <h3>
        {showOnlyCompleted ? "Completed" : "Pending"} Todos:{" "}
        {filteredTodos.length}
      </h3>
      <div className="completion-rate">Completion Rate: {completionRate}%</div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${completionRate}%` }}
        />
      </div>
    </div>
  );
};

export const syncTodoData = async (userId?: string) => {
  try {
    const endpoint = userId ? `/api/users/${userId}/todos` : "/api/todos";
    const todosResponse = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    });

    if (!todosResponse.ok) {
      throw new Error(`Failed to fetch todos: ${todosResponse.status}`);
    }

    const todos = await todosResponse.json();
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("lastSync", new Date().toISOString());

    // Fetch analytics data
    const statsResponse = await fetch("/api/todos/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    });

    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      localStorage.setItem("todoStats", JSON.stringify(stats));
      return { todos, stats };
    }

    return { todos, stats: null };
  } catch (error) {
    console.error("Error syncing todo data:", error);
    // Fallback to cached data
    const cachedTodos = localStorage.getItem("todos");
    return {
      todos: cachedTodos ? JSON.parse(cachedTodos) : [],
      stats: null,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};
