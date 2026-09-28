import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, required: true },
    institution: { type: String, default: '' },
    message: { type: String, required: true },
    preferredContact: {
      type: String,
      enum: ['email', 'phone', 'whatsapp'],
      default: 'email',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Completed', 'Closed'],
      default: 'New',
    },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;