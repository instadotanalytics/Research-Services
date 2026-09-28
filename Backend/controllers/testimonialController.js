import Testimonial from '../models/Testimonial.js';

export const getTestimonials = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { status: true };
    const data = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const data = await Testimonial.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const data = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};