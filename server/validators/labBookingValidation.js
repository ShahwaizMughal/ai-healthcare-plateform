import { body } from 'express-validator';

export const labBookingStatusValidator = [
  body('status')
    .isIn(['pending', 'confirmed', 'completed', 'cancelled'])
    .withMessage('Invalid status. Must be pending, confirmed, completed, or cancelled.')
];
