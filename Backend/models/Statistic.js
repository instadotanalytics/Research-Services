import mongoose from 'mongoose';

const statisticSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    value: { type: String, required: true },
    icon: { type: String, default: 'Award' },
    status: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Statistic = mongoose.model('Statistic', statisticSchema);
export default Statistic;