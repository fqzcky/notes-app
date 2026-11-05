import { Router } from 'express';
import pkg from '@prisma/client';         // <-- Pastikan ada
const { PrismaClient } = pkg;              // <-- Lalu ini
import { verifyToken } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();
// Semua route di bawah ini WAJIB login (diproteksi middleware)
router.use(verifyToken);

// GET semua notes milik user yg login
router.get('/', async (req, res) => {
  const notes = await prisma.note.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(notes);
});

// CREATE
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const note = await prisma.note.create({
    data: { title, content, userId: req.userId }
  });
  res.status(201).json(note);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, isDone } = req.body;
  const note = await prisma.note.updateMany({
    where: { id: Number(id), userId: req.userId }, // pastikan hanya bisa edit miliknya sendiri
    data: { title, content, isDone }
  });
  if (note.count === 0) return res.status(404).json({ message: 'Note tidak ditemukan' });
  res.json({ message: 'Berhasil diupdate' });
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleteNote = await prisma.note.deleteMany({
    where: { id: Number(id), userId: req.userId }
  });
  if (deleteNote.count === 0) return res.status(404).json({ message: 'Note tidak ditemukan' });
  res.json({ message: 'Berhasil dihapus' });
});

export default router;