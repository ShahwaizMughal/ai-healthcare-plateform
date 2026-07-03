import { Schema, model } from 'mongoose';

const orderItemSchema = new Schema({
  medicineId: {
    type: Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  lineTotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Null for guest checkout
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [
        (val) => val.length > 0,
        'Order must contain at least one item',
      ],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    billingName: {
      type: String,
      required: [true, 'Billing name is required'],
      trim: true,
    },
    billingAddress: {
      type: String,
      required: [true, 'Billing address is required'],
      trim: true,
    },
    billingCity: {
      type: String,
      required: [true, 'Billing city is required'],
      trim: true,
    },
    billingPostalCode: {
      type: String,
      required: [true, 'Billing postal code is required'],
      trim: true,
    },
    billingPhone: {
      type: String,
      required: [true, 'Billing phone number is required'],
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card_simulated'],
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });

export default model('Order', orderSchema);
