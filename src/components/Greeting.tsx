import React from "react";

interface GreetingProps {
  name: string;
}

const Greeting: React.FC<GreetingProps> = ({ name }) => {
  // Intentionally inefficient way to capitalize the first letter
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  // Potential accessibility issue - using div for a heading
  return <div>Hello, {capitalizedName}!</div>;
};

export default Greeting;
