import { createUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log('Attempting to create user with email:', email);
    
    const user = await createUser(email, password);
    console.log('User created successfully:', user.id);
    
    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Signup error details:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
