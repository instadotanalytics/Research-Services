import ContactMessage from '../models/ContactMessage.js';

export const createContact = async (req, res, next) => {
  try {
    const msg = await ContactMessage.create(req.body);
    res.status(201).json({ message: 'Message sent successfully', msg });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const msgs = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!msg) return res.status(404).json({ message: 'Not found' });
    res.json(msg);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};