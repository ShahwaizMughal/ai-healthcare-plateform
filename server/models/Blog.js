import { Schema, model } from 'mongoose';

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Health Tips', 'Disease Information', 'Nutrition', 'Wellness'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      maxlength: [250, 'Excerpt cannot exceed 250 characters'],
      default: '',
    },
    coverImageUrl: {
      type: String,
      required: [true, 'Cover image URL is required'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
blogSchema.index({ category: 1, status: 1 });

// Middleware to set publishedAt date when transitioning to 'published'
blogSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default model('Blog', blogSchema);
