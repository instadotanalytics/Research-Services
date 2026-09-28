import express from 'express';
import {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createContact);
router.get('/', protect, getContacts);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);

export default router;