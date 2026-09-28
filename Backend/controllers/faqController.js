
import FAQ from '../models/FAQ.js';

export const getFAQs = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { status: true };
    const data = await FAQ.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createFAQ = async (req, res, next) => {
  try {
    const data = await FAQ.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateFAQ = async (req, res, next) => {
  try {
    const data = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteFAQ = async (req, res, next) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};