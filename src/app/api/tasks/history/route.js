import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getCompletedTasks, getDeletedTasks } from '@/lib/tasks';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [completed, deleted] = await Promise.all([
    getCompletedTasks(session.user.id),
    getDeletedTasks(session.user.id),
  ]);

  return NextResponse.json({ completed, deleted });
}
