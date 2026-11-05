import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';         // <-- Pastikan baris ini ada!
const { PrismaClient } = pkg;              // <-- Baru yang ini
const prisma = new PrismaClient();

const router = Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });
    res.status(201).json({ message: 'Registrasi berhasil', userId: user.id });
  } catch (error) {
    res.status(400).json({ message: 'Email sudah terdaftar' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(401).json({ message: 'Password salah' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

export default router;