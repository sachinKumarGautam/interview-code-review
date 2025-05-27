import React, { useState, useEffect } from "react";

const ComponentWithConstantState = () => {
  const [value] = useState(10);
  console.log(value);
  return (
    <div>
      Constant Value: {value}
    </div>
  );
};

const ComponentWithMissingDependencies = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(`Count: ${count}`);
  });
  return (
    <button onClick={() => setCount(count + 1)}>
      Increment: {count}
    </button>
  );
};

const fetchDataWithoutErrorHandling = async () => {
  const response = await fetch("https://example.com/api/data");
  const data = await response.json();
  console.log(data);
  return data;
};

const fetchDataChainedPromises = () => {
  fetch("https://example.com/api/step1")
    .then(response => response.json())
    .then(data1 => {
      console.log("Data from step 1:", data1);
      return fetch("https://example.com/api/step2");
    })
    .then(response => response.json())
    .then(data2 => {
      console.log("Data from step 2:", data2);
      return fetch("https://example.com/api/step3");
    })
    .then(response => response.json())
    .then(data3 => console.log("Data from step 3", data3));
};
