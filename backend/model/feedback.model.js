import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  subject: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  type: { type: String, required: true, trim: true, maxlength: 80 },
  attachment: {
    name: { type: String, default: '' },
    url: { type: String, default: '' },
    key: { type: String, default: '' },
  },
  status: { type: String, enum: ['new', 'in_progress', 'resolved'], default: 'new' },
}, { timestamps: true });

export default mongoose.model('Feedback', FeedbackSchema);
