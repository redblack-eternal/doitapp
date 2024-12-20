import { prisma } from './db';

export async function createTask(userId, { title, details, dueDate }) {
  return prisma.task.create({
    data: {
      title,
      details,
      dueDate: dueDate ? new Date(dueDate) : null,
      virtualDueDate: null,
      userId,
    },
  });
}

export async function getTodaysTasks(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return prisma.$queryRaw`
    WITH TasksWithDate AS (
      SELECT *,
        DATE_TRUNC('day', "dueDate" AT TIME ZONE 'UTC' AT TIME ZONE current_setting('TIMEZONE')) as local_date
      FROM "Task"
      WHERE "userId" = ${userId}
        AND "status" = 'PENDING'
    )
    SELECT *
    FROM TasksWithDate
    WHERE local_date = DATE_TRUNC('day', NOW() AT TIME ZONE current_setting('TIMEZONE'))
      OR "dueDate" IS NULL
    ORDER BY 
      COALESCE("virtualDueDate", "dueDate") ASC NULLS LAST,
      "priority" DESC,
      "createdAt" ASC
  `;
}

export async function getAllTasks(userId) {
  return prisma.$queryRaw`
    SELECT *
    FROM "Task"
    WHERE "userId" = ${userId}
      AND "status" = 'PENDING'
    ORDER BY 
      COALESCE("virtualDueDate", "dueDate") ASC NULLS LAST,
      "priority" DESC,
      "createdAt" ASC
  `;
}

export async function getCompletedTasks(userId) {
  return prisma.task.findMany({
    where: {
      userId,
      status: 'COMPLETED',
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function getDeletedTasks(userId) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return prisma.task.findMany({
    where: {
      userId,
      status: 'DELETED',
      deletedAt: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      deletedAt: 'desc',
    },
  });
}

export async function updateTaskStatus(taskId, userId, status) {
  return prisma.task.updateMany({
    where: {
      id: taskId,
      userId,
    },
    data: {
      status,
      deletedAt: status === 'DELETED' ? new Date() : null,
      updatedAt: new Date(),
    },
  });
}

export async function updateTaskPriority(taskId, userId, priorityChange) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  return prisma.task.updateMany({
    where: {
      id: taskId,
      userId,
    },
    data: {
      priority: task.priority + priorityChange,
      updatedAt: new Date(),
    },
  });
}

export async function updateTaskVirtualDueDate(taskId, userId, referenceTaskId) {
  // Get the reference task
  const referenceTask = await prisma.task.findFirst({
    where: {
      id: referenceTaskId,
      userId,
    },
  });

  if (!referenceTask) {
    throw new Error('Reference task not found');
  }

  // Get the effective date of the reference task
  const referenceDate = referenceTask.virtualDueDate || referenceTask.dueDate;

  // Create a new virtual due date slightly before/after the reference date
  const newVirtualDueDate = referenceDate
    ? new Date(referenceDate.getTime() - 1000) // 1 second earlier
    : new Date(Date.now());

  return prisma.task.update({
    where: {
      id: taskId,
      userId,
    },
    data: {
      virtualDueDate: newVirtualDueDate,
      updatedAt: new Date(),
    },
  });
}

// Reset virtual due date when actual due date changes
export async function updateTaskDueDate(taskId, userId, newDueDate) {
  return prisma.task.update({
    where: {
      id: taskId,
      userId,
    },
    data: {
      dueDate: newDueDate ? new Date(newDueDate) : null,
      virtualDueDate: null, // Reset virtual due date
      updatedAt: new Date(),
    },
  });
} 