import Statistic from '../models/Statistic.js';

export const getStatistics = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { status: true };
    const data = await Statistic.find(filter).sort({ order: 1 });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createStatistic = async (req, res, next) => {
  try {
    const data = await Statistic.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateStatistic = async (req, res, next) => {
  try {
    const data = await Statistic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteStatistic = async (req, res, next) => {
  try {
    await Statistic.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};