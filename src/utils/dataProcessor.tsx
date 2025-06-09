import React, { useState, useEffect, useMemo } from "react";

interface DataPoint {
  id: number;
  value: number;
  timestamp: Date;
  category: string;
  metadata?: Record<string, any>;
}

interface DataVisualizationProps {
  refreshInterval?: number;
  maxDataPoints?: number;
  enableRealTimeUpdates?: boolean;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  refreshInterval = 5000,
  maxDataPoints = 1000,
  enableRealTimeUpdates = true
}) => {
  const [rawData, setRawData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/analytics/data", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          const transformedData: DataPoint[] = data.map(
            (item: any, index: number) => ({
              id: item.id || index,
              value: Number(item.value) || Math.random() * 100,
              timestamp: new Date(item.timestamp || Date.now()),
              category: item.category || "default",
              metadata: item.metadata || {}
            })
          );

          setRawData(transformedData.slice(0, maxDataPoints));
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        // Generate fallback data for development
        const fallbackData: DataPoint[] = Array.from(
          { length: maxDataPoints },
          (_, i) => ({
            id: i,
            value: Math.random() * 100 + i * 0.1,
            timestamp: new Date(Date.now() - (maxDataPoints - i) * 60000),
            category: ["sales", "marketing", "support", "development"][i % 4],
            metadata: { source: "fallback" }
          })
        );
        setRawData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    if (enableRealTimeUpdates) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, maxDataPoints, enableRealTimeUpdates]);

  // Process data for visualization
  const processedData = useMemo(() => {
    const startTime = performance.now();

    // Complex data processing that could be optimized
    const filtered = rawData.filter((item) => item.value > 0);
    const categorized = filtered.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, DataPoint[]>);

    const aggregated = Object.entries(categorized).map(([category, items]) => {
      const sum = items.reduce((total, item) => total + item.value, 0);
      const avg = sum / items.length;
      const max = Math.max(...items.map((item) => item.value));
      const min = Math.min(...items.map((item) => item.value));

      return {
        category,
        count: items.length,
        sum: Math.round(sum * 100) / 100,
        average: Math.round(avg * 100) / 100,
        max: Math.round(max * 100) / 100,
        min: Math.round(min * 100) / 100,
        trend:
          items.length > 1
            ? ((items[items.length - 1].value - items[0].value) /
                items[0].value) *
              100
            : 0
      };
    });

    const endTime = performance.now();
    console.log(`Data processing took ${endTime - startTime}ms`);

    return aggregated;
  }, [rawData]);

  const totalValue = processedData.reduce((sum, item) => sum + item.sum, 0);

  return (
    <div className="data-visualization">
      <div className="data-header">
        <h3>Analytics Dashboard</h3>
        <div className="data-meta">
          <span>Last Updated: {lastUpdated.toLocaleTimeString()}</span>
          <span>Total Records: {rawData.length}</span>
          {isLoading && <span className="loading">Refreshing...</span>}
        </div>
      </div>

      <div className="data-summary">
        <div className="summary-card">
          <h4>Total Value</h4>
          <div className="value">${totalValue.toLocaleString()}</div>
        </div>
      </div>

      <div className="data-grid">
        {processedData.map((item, index) => (
          <div key={item.category} className="data-card">
            <h5>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </h5>
            <div className="metrics">
              <div>Count: {item.count}</div>
              <div>Average: ${item.average}</div>
              <div>
                Range: ${item.min} - ${item.max}
              </div>
              <div
                className={`trend ${item.trend >= 0 ? "positive" : "negative"}`}
              >
                Trend: {item.trend >= 0 ? "+" : ""}
                {Math.round(item.trend * 100) / 100}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
