'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import TaskModal from '@/components/TaskModal';
import TaskItem from '@/components/TaskItem';

export default function Home() {
  const { data: session } = useSession();
  const [currentTask, setCurrentTask] = useState(null);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTodaysTasksExpanded, setIsTodaysTasksExpanded] = useState(true);

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTodaysTasks(data.today);
    setCurrentTask(data.today[0]);
  };

  const handleComplete = async (taskId) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    });
    fetchTasks();
  };

  const handlePostpone = async (taskId) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority: 0 }),
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

  const handleDelete = async (taskId) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'DELETED' }),
    });
    fetchTasks();
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] text-center px-4">
        <span className="text-3xl text-muted-foreground mb-2">
          Welcome to <i className="text-foreground">do it</i>
        </span>
        <h1 className="text-lg font-bold mb-2">
          A to-do list that works like a calendar
        </h1>
        <p className="text-base text-muted-foreground mb-12 max-w-md">
          Organize your tasks by date and time, just like your calendar
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center rounded-xl text-base font-medium 
              bg-[#5D4037] text-white hover:bg-[#6D4C41] h-12 px-10 py-2 w-36
              shadow-[0_4px_0px_0px_#4A332C] 
              hover:shadow-[0_2px_0px_0px_#4A332C]
              hover:translate-y-[2px] 
              active:translate-y-[4px]
              active:shadow-none
              transition-all duration-150"
          >
            Create account
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-xl text-base font-medium 
              bg-[#5D4037] text-white hover:bg-[#6D4C41] h-12 px-10 py-2 w-36
              shadow-[0_4px_0px_0px_#4A332C]
              hover:shadow-[0_2px_0px_0px_#4A332C]
              hover:translate-y-[2px]
              active:translate-y-[4px]
              active:shadow-none
              transition-all duration-150"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-4">Current Task</h2>
        {currentTask ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl">{currentTask.title}</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                title="Modify"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            
            <div className="bg-muted/50 rounded-md p-3">
              <p className="text-sm text-muted-foreground">
                {currentTask.details || 'No details added'}
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => handleComplete(currentTask.id)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Complete
              </button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No tasks for today. Add a new task to get started!</p>
        )}
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">All Tasks for Today</h2>
            <button
              onClick={() => setIsTodaysTasksExpanded(!isTodaysTasksExpanded)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isTodaysTasksExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div 
          className={`transform transition-all duration-200 ease-in-out ${
            isTodaysTasksExpanded ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
          <div className="p-6 pt-0">
            <div className="space-y-2 text-sm">
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
              {todaysTasks.length <= 1 && (
                <p className="text-muted-foreground">No additional tasks for today.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {currentTask && (
        <TaskModal
          task={currentTask}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={async (updatedTask) => {
            await handleModify(updatedTask);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
} 