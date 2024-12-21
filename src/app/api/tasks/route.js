import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { getAllTasks, getTodaysTasks, createTask } from '@/lib/tasks';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [today, all] = await Promise.all([
    getTodaysTasks(session.user.id),
    getAllTasks(session.user.id),
  ]);

  return NextResponse.json({ today, all });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const task = await createTask(session.user.id, data);
  return NextResponse.json(task);
}
