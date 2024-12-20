import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { 
  updateTaskStatus, 
  updateTaskDueDate,
  updateTaskVirtualDueDate,
  getAllTasks 
} from '@/lib/tasks';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const data = await request.json();
    
    if (data.status) {
      await updateTaskStatus(id, session.user.id, data.status);
    } else if (data.dueDate !== undefined) {
      await updateTaskDueDate(id, session.user.id, data.dueDate);
      if (data.title || data.details) {
        await prisma.task.update({
          where: { id, userId: session.user.id },
          data: {
            title: data.title,
            details: data.details,
          },
        });
      }
    } else if (data.moveDirection) {
      const tasks = await getAllTasks(session.user.id);
      const currentIndex = tasks.findIndex(task => task.id === id);
      
      if (data.moveDirection === 'up' && currentIndex > 0) {
        const referenceTask = tasks[currentIndex - 1];
        await updateTaskVirtualDueDate(id, session.user.id, referenceTask.id);
      } else if (data.moveDirection === 'down' && currentIndex < tasks.length - 1) {
        const referenceTask = tasks[currentIndex + 1];
        await updateTaskVirtualDueDate(id, session.user.id, referenceTask.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
