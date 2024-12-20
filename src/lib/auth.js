import { hash, compare } from 'bcryptjs';
import { prisma } from './db';

export async function createUser(email, password) {
  const hashedPassword = await hash(password, 12);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
}

export async function verifyUser(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isValid = await compare(password, user.password);

  if (!isValid) {
    return null;
  }

  return { id: user.id, email: user.email };
} 