import React, { useState } from "react";

interface TodoFormProps {
  onSubmit: (text: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [text, setText] = useState();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo"
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default TodoForm;
