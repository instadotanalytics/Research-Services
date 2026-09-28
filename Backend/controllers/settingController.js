import SiteSetting from '../models/SiteSetting.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) settings = await SiteSetting.create({});
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create(req.body);
    } else {
      settings = await SiteSetting.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};