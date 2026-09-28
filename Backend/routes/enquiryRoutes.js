import express from 'express';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createEnquiry);
router.get('/', protect, getEnquiries);
router.get('/:id', protect, getEnquiryById);
router.put('/:id', protect, updateEnquiry);
router.delete('/:id', protect, deleteEnquiry);

export default router;