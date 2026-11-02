import FeedbackModel from '../model/feedback.model.js';
import { uploadFile } from '../middleware/imageupload.js';

const allowedTypes = new Set([
  'Login / Account issue',
  'Billing / Payment',
  'Course content error',
  'App not working',
  'Learning progress issue',
  'Other',
]);

export const createFeedback = async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const subject = String(req.body?.subject || '').trim();
  const description = String(req.body?.description || '').trim();
  const type = String(req.body?.type || '').trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
  }
  if (!subject || subject.length > 160 || !description || description.length > 5000 || !allowedTypes.has(type)) {
    return res.status(400).json({ success: false, message: 'Complete the required fields with valid values.' });
  }

  try {
    let attachment = { name: '', url: '', key: '' };
    if (req.file) {
      const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
      if (!allowedMimeTypes.has(req.file.mimetype)) {
        return res.status(400).json({ success: false, message: 'Attach a PNG, JPG, WEBP, or PDF file.' });
      }
      const uploaded = await uploadFile(req.file);
      attachment = { name: req.file.originalname, url: uploaded.url, key: uploaded.key };
    }

    const feedback = await FeedbackModel.create({ email, subject, description, type, attachment });
    return res.status(201).json({
      success: true,
      message: 'Your feedback was sent successfully.',
      result: { ticketId: String(feedback._id), createdAt: feedback.createdAt },
    });
  } catch (error) {
    console.error('Feedback submission failed:', error);
    return res.status(500).json({ success: false, message: 'Could not send feedback. Please try again.' });
  }
};
