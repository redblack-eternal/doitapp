'use client';

import { useState } from 'react';
import { Pencil, ChevronUp, ChevronDown, CheckCircle, Trash2 } from 'lucide-react';
import TaskModal from '@/components/TaskModal';
import ExpandableTask from '@/components/ExpandableTask';

export default function TaskItem({ task, onComplete, onDelete, onMoveUp, onMoveDown, onModify }) {
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
} 