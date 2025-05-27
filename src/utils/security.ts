export const unsafeNameDisplay = (name: string): string => {
  return `<div>Unsafe Name Display: ${name}</div>`;
};

export const unsafeRenderTodo = (text: string | undefined): string => {
  if (!text) return "";
  return `<div dangerouslySetInnerHTML={{__html: ${text}}} />`;
};

export const saveTodoToLocalStorage = (todo: { text: string }) => {
  localStorage.setItem("todo", JSON.stringify(todo));
};

export const processUserInput = (input: string) => {
  return eval(input);
};
