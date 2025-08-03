import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/server/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (password.length < 6) return res.status(400).json({ error: 'Password too short' });
  try {
    const exists = await prisma.user.findFirst({ where: { email: { equals: email } } });
    if (exists) return res.status(409).json({ error: 'User already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash, name: email.split('@')[0] } });
    return res.status(201).json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    return res.status(500).json({ error: 'Registration failed' });
  }
} 