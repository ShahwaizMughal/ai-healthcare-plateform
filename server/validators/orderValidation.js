import { body } from 'express-validator';

export const orderStatusValidator = [
  body('status')
    .isIn(['placed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status. Must be placed, processing, shipped, delivered, or cancelled.')
];
