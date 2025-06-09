import React, { useState, useEffect, useRef } from "react";

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  headers?: Record<string, string>;
}

interface RequestConfig {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  skipAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private defaultConfig: RequestConfig;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
    this.defaultConfig = {
      timeout: 10000,
      retries: 3,
      cache: true,
      skipAuth: false
    };
    this.cache = new Map();
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = `${options.method || "GET"}:${url}:${JSON.stringify(
      options.body
    )}`;

    // Check cache first
    if (finalConfig.cache && options.method === "GET") {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return { data: cached.data, status: 200 };
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {})
    };

    // Add auth header - but doesn't validate token expiry
    if (!finalConfig.skipAuth) {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(finalConfig.timeout!)
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= finalConfig.retries!; attempt++) {
      try {
        const response = await fetch(url, requestOptions);

        const responseData = response.headers
          .get("content-type")
          ?.includes("application/json")
          ? await response.json()
          : await response.text();

        if (!response.ok) {
          return {
            error: responseData.message || `HTTP ${response.status}`,
            status: response.status,
            data: responseData
          };
        }

        // Cache successful GET requests
        if (finalConfig.cache && options.method === "GET") {
          this.cache.set(cacheKey, {
            data: responseData,
            timestamp: Date.now(),
            ttl: 5 * 60 * 1000 // 5 minutes
          });
        }

        return {
          data: responseData,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries())
        };
      } catch (error) {
        lastError = error as Error;

        if (attempt < finalConfig.retries!) {
          // Exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    return {
      error: lastError?.message || "Network request failed",
      status: 0
    };
  }

  async get<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "GET" }, config);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined
      },
      config
    );
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined
      },
      config
    );
  }

  async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "DELETE" }, config);
  }

  clearCache() {
    this.cache.clear();
  }
}

// Global API client instance
export const apiClient = new ApiClient();

// React hook for API calls
export function useApiCall<T>(
  endpoint: string,
  options: RequestConfig & { immediate?: boolean } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const execute = async (requestData?: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = requestData
        ? await apiClient.post<T>(endpoint, requestData, options)
        : await apiClient.get<T>(endpoint, options);

      if (mountedRef.current) {
        if (response.error) {
          setError(response.error);
        } else {
          setData(response.data || null);
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    if (options.immediate !== false) {
      execute();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [endpoint]);

  return { data, loading, error, execute, refetch: () => execute() };
}

// Component for displaying static values - has React best practice issues
export const StaticValueDisplay: React.FC<{
  initialValue?: number;
  label?: string;
}> = ({ initialValue = 10, label = "Value" }) => {
  const [value] = useState(initialValue);

  // This runs on every render - performance issue
  const expensiveCalculation = () => {
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.random();
    }
    return result;
  };

  const calculatedValue = expensiveCalculation();

  console.log(`${label}: ${value}`); // Side effect in render

  return (
    <div className="static-display">
      <h4>
        {label}: {value}
      </h4>
      <small>Calculated: {Math.round(calculatedValue)}</small>
    </div>
  );
};

// Counter component with dependency issues
export const CounterButton: React.FC<{
  onCountChange?: (count: number) => void;
  step?: number;
}> = ({ onCountChange, step = 1 }) => {
  const [count, setCount] = useState(0);

  // Missing dependency - useEffect will have stale closure
  useEffect(() => {
    console.log(`Current count: ${count}`);

    if (onCountChange) {
      onCountChange(count);
    }
  }); // Missing dependency array

  const increment = () => {
    setCount(count + step); // Should use functional update for better concurrency
  };

  return (
    <div className="counter-button">
      <button onClick={increment} className="btn btn-primary">
        Count: {count} (+{step})
      </button>
    </div>
  );
};

// API utility functions
export const fetchUserProfile = async (userId: string) => {
  const response = await apiClient.get(`/users/${userId}/profile`);

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
};

export const updateUserPreferences = async (
  preferences: Record<string, any>
) => {
  // This doesn't validate the preferences object - potential security issue
  const response = await apiClient.put("/user/preferences", preferences);

  if (response.error) {
    console.error("Failed to update preferences:", response.error);
    return false;
  }

  // Update local cache immediately - optimistic update
  localStorage.setItem("userPreferences", JSON.stringify(preferences));

  return true;
};

export const processDataWorkflow = async (workflowId: string) => {
  try {
    // Step 1: Initialize workflow
    const initResponse = await apiClient.post<{ sessionId: string }>(
      "/workflows/init",
      { workflowId }
    );
    if (initResponse.error) throw new Error(initResponse.error);

    // Step 2: Process data
    const processResponse = await apiClient.post("/workflows/process", {
      sessionId: initResponse.data?.sessionId,
      workflowId
    });
    if (processResponse.error) throw new Error(processResponse.error);

    // Step 3: Finalize
    const finalizeResponse = await apiClient.post("/workflows/finalize", {
      sessionId: initResponse.data?.sessionId
    });

    return {
      success: !finalizeResponse.error,
      result: finalizeResponse.data,
      sessionId: initResponse.data?.sessionId
    };
  } catch (error) {
    console.error("Workflow processing failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};
