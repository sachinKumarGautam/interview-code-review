import React, { useState, useEffect } from "react";

// Performance: Expensive calculation on every render.
export const ExpensiveComponent = () => {
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    const initialData = Array.from({ length: 10000 }, (_, i) => i + 1);
    setData(initialData);
  }, []);

  // Simulate an expensive calculation (e.g., filtering, mapping, reducing)
  const processedData = data
    .filter(item => item % 2 === 0)
    .map(item => item * 2)
    .reduce((acc, curr) => acc + curr, 0);

  return (
    <div>
      <p>
        Processed Data: {processedData}
      </p>
    </div>
  );
};
