import { Schema, model } from 'mongoose';

const contactMessageSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    subject: {
      type: String,
      maxlength: [150, 'Subject cannot exceed 150 characters'],
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message body is required'],
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
contactMessageSchema.index({ isRead: 1 });

export default model('ContactMessage', contactMessageSchema);
