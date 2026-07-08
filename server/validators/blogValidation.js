import { body } from 'express-validator';

export const blogValidator = [
  body('title').trim().notEmpty().withMessage('Required fields are missing.'),
  body('category').trim().notEmpty().withMessage('Required fields are missing.'),
  body('content').trim().notEmpty().withMessage('Required fields are missing.'),
  body('coverImageUrl').trim().notEmpty().withMessage('Required fields are missing.'),
  body('author').trim().notEmpty().withMessage('Required fields are missing.')
];
