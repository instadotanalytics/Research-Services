import express from 'express';
import {
  getStatistics,
  createStatistic,
  updateStatistic,
  deleteStatistic,
} from '../controllers/statisticController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getStatistics);
router.post('/', protect, createStatistic);
router.put('/:id', protect, updateStatistic);
router.delete('/:id', protect, deleteStatistic);

export default router;