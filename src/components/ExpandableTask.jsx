import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ExpandableTask({ task, actions }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg border bg-card text-card-foreground transition-all duration-200">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          <span className="text-sm">{task.title}</span>
        </div>
        <div className="flex gap-2">
          {actions}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="pl-8">
            <div className="bg-muted/50 rounded-md p-3">
              <p className="text-sm text-muted-foreground">
                {task.details || 'No details added'}
              </p>
              {task.dueDate && (
                <p className="text-xs text-muted-foreground mt-2">
                  Due: {new Date(task.dueDate).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 