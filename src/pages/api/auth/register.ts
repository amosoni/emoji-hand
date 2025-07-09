import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/server/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (password.length < 6) return res.status(400).json({ error: 'Password too short' });
  try {
    const exists = await prisma.user.findFirst({ where: { OR: [{ email: { equals: email } }, { username: { equals: username } }] } });
    if (exists) return res.status(409).json({ error: 'User already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { username, email, passwordHash, name: username } });
    return res.status(201).json({ ok: true, user: { id: user.id, username: user.username ?? user.name, email: user.email } });
  } catch (e) {
    return res.status(500).json({ error: 'Registration failed' });
  }
} 