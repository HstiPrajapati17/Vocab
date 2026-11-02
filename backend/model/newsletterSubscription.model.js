import mongoose from 'mongoose';

const NewsletterSubscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subscribedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('NewsletterSubscription', NewsletterSubscriptionSchema);
