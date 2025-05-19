import React, { useState, useEffect } from "react";

//  Best Practices:  Using useState without a setter (effectively a constant).
const ComponentWithConstantState = () => {
  const [value] = useState(10);
  console.log(value);
  return (
    <div>
      Constant Value: {value}
    </div>
  );
};

//   Best Practices: Missing dependency array, causing unnecessary re-runs
const ComponentWithMissingDependencies = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(`Count: ${count}`);
  }); // Missing dependency array
  return (
    <button onClick={() => setCount(count + 1)}>
      Increment: {count}
    </button>
  );
};

// Best Practices:  Using async function without error handling
const fetchDataWithoutErrorHandling = async () => {
  const response = await fetch("https://example.com/api/data"); // Potential error here
  const data = await response.json();
  console.log(data);
  return data;
};

// Best Practices:  Chaining Promises without proper error handling
const fetchDataChainedPromises = () => {
  fetch("https://example.com/api/step1")
    .then(response => response.json())
    .then(data1 => {
      console.log("Data from step 1:", data1);
      return fetch("https://example.com/api/step2"); // Potential error here
    })
    .then(response => response.json())
    .then(data2 => {
      console.log("Data from step 2:", data2);
      // Missing a .catch block!
      return fetch("https://example.com/api/step3");
    })
    .then(response => response.json())
    .then(data3 => console.log("Data from step 3", data3));
};
