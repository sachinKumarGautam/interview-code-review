import React from "react";
import { Button } from "@/components/ui/button";

interface GreetingProps {
  name: string;
}

const Greeting: React.FC<GreetingProps> = ({ name }) => {
  //  Performance: Re-rendering the same string on every render.
  const greetingMessage = `Hello, ${name}!`;

  return (
    <div>
      {greetingMessage}
      <Button onClick={() => alert("Clicked!")}>Click Me</Button>{" "}
      {/* Missing Accessibility Label */}
    </div>
  );
};

export default Greeting;
