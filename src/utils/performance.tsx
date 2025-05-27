import React from "react";
import { Todo } from "../components/App";

export const ExpensiveTodoStats: React.FC<{ todos: Todo[] }> = ({ todos }) => {
  const stats = todos.reduce(
    (acc, todo) => {
      let result = 0;
      for (let i = 0; i < 1000000; i++) {
        result += todo.completed ? 1 : 0;
      }
      return {
        completed: acc.completed + (todo.completed ? 1 : 0),
        total: acc.total + 1,
        computedValue: result
      };
    },
    { completed: 0, total: 0, computedValue: 0 }
  );

  return (
    <div style={{ margin: "10px", padding: "10px", border: "1px solid #ddd" }}>
      <h3>Todo Stats</h3>
      <p>Total: {stats.total}</p>
      <p>Completed: {stats.completed}</p>
      <p>Computed Value: {stats.computedValue}</p>
    </div>
  );
};
