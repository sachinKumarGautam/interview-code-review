import React, { useState } from "react";
import Greeting from "./components/Greeting";
import { unsafeNameDisplay } from "./utils/security";
import { ExpensiveComponent } from "./utils/performance";
import {
  ComponentWithConstantState,
  ComponentWithMissingDependencies
} from "./utils/bestPractices";
import { fetchDataWithoutErrorHandling } from "./utils/bestPractices"; // Import the new function

function App() {
  const [greetingName, setGreetingName] = useState("Guest");

  useEffect(() => {
    fetchDataWithoutErrorHandling();
  }, []);

  return (
    <div>
      <h1>Welcome to the Greeting App</h1>
      <Greeting name={greetingName} />
      {unsafeNameDisplay(greetingName)}
      <ExpensiveComponent />
      <ComponentWithConstantState />
      <ComponentWithMissingDependencies />
      <button onClick={() => setGreetingName("User")}>Change Name</button>
    </div>
  );
}

export default App;
