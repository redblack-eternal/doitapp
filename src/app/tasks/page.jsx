'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ArrowUpDown, CheckCircle, Trash2, ChevronUp, ChevronDown, Pencil } from 'lucide-react';
import TaskModal from '@/components/TaskModal';
import ExpandableTask from '@/components/ExpandableTask';

const TaskItem = ({ task, onComplete, onDelete, onMoveUp, onMoveDown, onModify }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const actionButtons = (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        title="Modify"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={() => onMoveUp(task.id)}
        className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        title="Move Up"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <button
        onClick={() => onMoveDown(task.id)}
        className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        title="Move Down"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
      <button
        onClick={() => onComplete(task.id)}
        className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        title="Complete"
      >
        <CheckCircle className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDelete(task.id)}
        className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </>
  );

  return (
    <>
      <ExpandableTask task={task} actions={actionButtons} />
      
      <TaskModal
        task={task}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (updatedTask) => {
          await onModify(updatedTask);
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default function Tasks() {
  const { data: session } = useSession();
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTodaysTasks(data.today);
    setAllTasks(data.all);
  };

  const handleComplete = async (taskId) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    });
    fetchTasks();
  };

  const handleDelete = async (taskId) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'DELETED' }),
    });
    fetchTasks();
  };

  const handleMoveUp = async (taskId) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moveDirection: 'up' }),
    });
    fetchTasks();
  };

  const handleMoveDown = async (taskId) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moveDirection: 'down' }),
    });
    fetchTasks();
  };

  const handleModify = async (updatedTask) => {
    await fetch(`/api/tasks/${updatedTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: updatedTask.title,
        details: updatedTask.details,
        dueDate: updatedTask.dueDate,
      }),
    });
    fetchTasks();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Today's Tasks</h2>
        <div className="space-y-2">
          {todaysTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={handleComplete}
              onDelete={handleDelete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onModify={handleModify}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">All Tasks</h2>
        <div className="space-y-2">
          {allTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={handleComplete}
              onDelete={handleDelete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onModify={handleModify}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 