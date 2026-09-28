import express from 'express';
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from '../controllers/faqController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getFAQs);
router.post('/', protect, createFAQ);
router.put('/:id', protect, updateFAQ);
router.delete('/:id', protect, deleteFAQ);

export default router;