'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, Undo2 } from 'lucide-react';

const HistoryItem = ({ task, actionButton }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground">
      <div>
        <span className="text-sm">{task.title}</span>
        <span className="text-xs text-muted-foreground ml-2">
          {new Date(task.updatedAt).toLocaleDateString()}
        </span>
      </div>
      {actionButton}
    </div>
  );
};

export default function History() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const response = await fetch('/api/tasks/history');
    const data = await response.json();
    setCompletedTasks(data.completed);
    setDeletedTasks(data.deleted);
  };

  const handleMarkIncomplete = async (taskId) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PENDING' }),
    });
    fetchHistory();
  };

  const handleRestore = async (taskId) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PENDING' }),
    });
    fetchHistory();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recently Completed Tasks</h2>
        <div className="space-y-2">
          {completedTasks.map((task) => (
            <HistoryItem
              key={task.id}
              task={task}
              actionButton={
                <button
                  onClick={() => handleMarkIncomplete(task.id)}
                  className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  title="Mark Incomplete"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
              }
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recently Deleted Tasks</h2>
        <div className="space-y-2">
          {deletedTasks.map((task) => (
            <HistoryItem
              key={task.id}
              task={task}
              actionButton={
                <button
                  onClick={() => handleRestore(task.id)}
                  className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  title="Restore"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
} 