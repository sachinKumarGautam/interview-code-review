import React, { useMemo, useState, useEffect } from "react";
import { Todo } from "../components/App";

interface TodoAnalyticsProps {
  todos: Todo[];
  enableDetailedAnalytics?: boolean;
  refreshInterval?: number;
}

interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  averageCompletionTime?: number;
  categorizedStats: Record<string, number>;
  priorityDistribution: Record<string, number>;
  recentActivity: {
    completedToday: number;
    completedThisWeek: number;
    completedThisMonth: number;
  };
}

export const TodoAnalytics: React.FC<TodoAnalyticsProps> = ({
  todos,
  enableDetailedAnalytics = true,
  refreshInterval = 30000
}) => {
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Fetch historical data for trends
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch("/api/todos/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          setHistoricalData(data);
        }
      } catch (error) {
        console.error("Failed to fetch historical data:", error);
      }
    };

    if (enableDetailedAnalytics) {
      fetchHistoricalData();
      const interval = setInterval(fetchHistoricalData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [enableDetailedAnalytics, refreshInterval]);

  // Calculate comprehensive todo statistics
  const stats = useMemo<TodoStats>(() => {
    setIsCalculating(true);
    const startTime = performance.now();

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const weekStart = new Date(
      todayStart.getTime() - todayStart.getDay() * 24 * 60 * 60 * 1000
    );
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const completed = todos.filter((todo) => todo.completed);
    const pending = todos.filter((todo) => !todo.completed);

    // Simulate complex calculation that could be optimized
    const categorizedStats: Record<string, number> = {};
    const priorityDistribution: Record<string, number> = {
      high: 0,
      medium: 0,
      low: 0
    };

    todos.forEach((todo) => {
      // Simulate expensive operation for each todo
      for (let i = 0; i < 100; i++) {
        Math.random(); // Simulating complex calculation
      }

      const category = (todo as any).category || "general";
      const priority = (todo as any).priority || "medium";

      categorizedStats[category] = (categorizedStats[category] || 0) + 1;
      priorityDistribution[priority] =
        (priorityDistribution[priority] || 0) + 1;
    });

    // Calculate completion times
    let totalCompletionTime = 0;
    let completedWithTimeData = 0;

    completed.forEach((todo) => {
      const createdAt = (todo as any).createdAt;
      const completedAt = (todo as any).completedAt;

      if (createdAt && completedAt) {
        const completionTime =
          new Date(completedAt).getTime() - new Date(createdAt).getTime();
        totalCompletionTime += completionTime;
        completedWithTimeData++;
      }
    });

    const averageCompletionTime =
      completedWithTimeData > 0
        ? totalCompletionTime / completedWithTimeData / (1000 * 60 * 60 * 24) // Convert to days
        : undefined;

    // Calculate recent activity
    const completedToday = completed.filter((todo) => {
      const completedDate = (todo as any).completedAt;
      return completedDate && new Date(completedDate) >= todayStart;
    }).length;

    const completedThisWeek = completed.filter((todo) => {
      const completedDate = (todo as any).completedAt;
      return completedDate && new Date(completedDate) >= weekStart;
    }).length;

    const completedThisMonth = completed.filter((todo) => {
      const completedDate = (todo as any).completedAt;
      return completedDate && new Date(completedDate) >= monthStart;
    }).length;

    const endTime = performance.now();
    console.log(
      `Todo analytics calculation took ${endTime - startTime}ms for ${
        todos.length
      } todos`
    );

    setIsCalculating(false);

    return {
      total: todos.length,
      completed: completed.length,
      pending: pending.length,
      completionRate:
        todos.length > 0
          ? Math.round((completed.length / todos.length) * 100)
          : 0,
      averageCompletionTime: averageCompletionTime
        ? Math.round(averageCompletionTime * 10) / 10
        : undefined,
      categorizedStats,
      priorityDistribution,
      recentActivity: {
        completedToday,
        completedThisWeek,
        completedThisMonth
      }
    };
  }, [todos]);

  const renderCategoryBreakdown = () => {
    return Object.entries(stats.categorizedStats).map(([category, count]) => (
      <div key={category} className="category-stat">
        <span className="category-name">{category}</span>
        <span className="category-count">{count}</span>
        <div className="category-bar">
          <div
            className="category-fill"
            style={{ width: `${(count / stats.total) * 100}%` }}
          />
        </div>
      </div>
    ));
  };

  const renderPriorityDistribution = () => {
    return Object.entries(stats.priorityDistribution).map(
      ([priority, count]) => (
        <div key={priority} className={`priority-stat priority-${priority}`}>
          <span>
            {priority.toUpperCase()}: {count}
          </span>
        </div>
      )
    );
  };

  return (
    <div className="todo-analytics">
      <div className="analytics-header">
        <h3>Todo Analytics Dashboard</h3>
        {isCalculating && <span className="calculating">Calculating...</span>}
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <h4>Overview</h4>
          <div className="stat-row">
            <span>Total Tasks:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-row">
            <span>Completed:</span>
            <span className="stat-value completed">{stats.completed}</span>
          </div>
          <div className="stat-row">
            <span>Pending:</span>
            <span className="stat-value pending">{stats.pending}</span>
          </div>
          <div className="completion-rate-large">
            <span>Completion Rate: {stats.completionRate}%</span>
            <div className="progress-bar-large">
              <div
                className="progress-fill-large"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h4>Recent Activity</h4>
          <div className="activity-stats">
            <div className="activity-item">
              <span>Today:</span>
              <span>{stats.recentActivity.completedToday}</span>
            </div>
            <div className="activity-item">
              <span>This Week:</span>
              <span>{stats.recentActivity.completedThisWeek}</span>
            </div>
            <div className="activity-item">
              <span>This Month:</span>
              <span>{stats.recentActivity.completedThisMonth}</span>
            </div>
          </div>
          {stats.averageCompletionTime && (
            <div className="avg-completion">
              <span>
                Avg. Completion Time: {stats.averageCompletionTime} days
              </span>
            </div>
          )}
        </div>

        {enableDetailedAnalytics && (
          <>
            <div className="stat-card">
              <h4>Categories</h4>
              <div className="category-breakdown">
                {renderCategoryBreakdown()}
              </div>
            </div>

            <div className="stat-card">
              <h4>Priority Distribution</h4>
              <div className="priority-breakdown">
                {renderPriorityDistribution()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
