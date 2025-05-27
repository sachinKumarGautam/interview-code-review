//  Security:  Inadequate output sanitization leading to potential XSS.
export const unsafeNameDisplay = (name: string): string => {
  return `<div>Unsafe Name Display: ${name}</div>`;
};

// Issue: Unsafe HTML rendering
export const unsafeRenderTodo = (text: string | undefined): string => {
  if (!text) return "";
  // Issue: XSS vulnerability
  return `<div dangerouslySetInnerHTML={{__html: ${text}}} />`;
};

// Issue: Insecure data storage
export const saveTodoToLocalStorage = (todo: { text: string }) => {
  // Issue: Storing sensitive data without encryption
  localStorage.setItem("todo", JSON.stringify(todo));
};

// Issue: No input sanitization
export const processUserInput = (input: string) => {
  // Issue: Direct use of user input without sanitization
  return eval(input);
};
