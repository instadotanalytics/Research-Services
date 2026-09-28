import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    benefits: [{ type: String }],
    process: [{ step: String, description: String }],
    audience: [{ type: String }],
    faqs: [{ question: String, answer: String }],
    icon: { type: String, default: 'BookOpen' },
    image: { type: String, default: '' },
    ctaText: { type: String, default: 'Get Research Assistance' },
    status: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;