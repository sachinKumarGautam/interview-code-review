import React, { useState, useEffect } from "react";
import Greeting from "./components/Greeting";
import { unsafeNameDisplay } from "./utils/security";
import { ExpensiveComponent } from "./utils/performance";
import {
  ComponentWithConstantState,
  ComponentWithMissingDependencies,
  fetchDataChainedPromises
} from "./utils/bestPractices";
import UserProfile from "./components/UserProfile";
import ProductList from "./components/ProductList";
import OrderForm from "./components/OrderForm";
import ErrorBoundary from "./components/ErrorBoundary";
import MyComponent from "./components/MyComponent";

function App() {
  const [greetingName, setGreetingName] = useState("Guest");
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    fetchDataWithoutErrorHandling();
    fetchDataChainedPromises();
  }, []);

  return (
    <div>
      <h1>Welcome to the Greeting App</h1>
      <ErrorBoundary>
        {showGreeting && <Greeting name={greetingName} />}
        {unsafeNameDisplay(greetingName)}
        <ExpensiveComponent />
        <ComponentWithConstantState />
        <ComponentWithMissingDependencies />
        <UserProfile userId="123" />
        <ProductList />
        <OrderForm />
        <MyComponent />
        <button onClick={() => setGreetingName("User")}>Change Name</button>
        <button onClick={() => setShowGreeting((prev) => !prev)}>
          Toggle Greeting
        </button>
      </ErrorBoundary>
    </div>
  );
}

export default App;
