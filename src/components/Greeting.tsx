import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface GreetingProps {
  name: string;
}

const Greeting: React.FC<GreetingProps> = ({ name }) => {
  const greetingMessage = `Hello, ${name}!`;
  const [localName, setLocalName] = useState(name);

  useEffect(() => {
    if (name !== "Guest") {
      setLocalName(name);
    }
  }, [name]);

  return (
    <div>
      {greetingMessage}
      <Button
        onClick={() => alert("Clicked!")}
        aria-label={`Greet ${localName}`}
      >
        Click Me
      </Button>{" "}
      <p>Welcome, {name.trim()}!</p>
    </div>
  );
};

export default Greeting;
