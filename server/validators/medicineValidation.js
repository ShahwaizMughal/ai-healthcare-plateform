import { body } from 'express-validator';

export const medicineValidator = [
  body('name').trim().notEmpty().withMessage('Required fields are missing.'),
  body('description').trim().notEmpty().withMessage('Required fields are missing.'),
  body('dosage').trim().notEmpty().withMessage('Required fields are missing.'),
  body('category').trim().notEmpty().withMessage('Required fields are missing.'),
  body('price').exists().withMessage('Required fields are missing.'),
  body('imageUrl').trim().notEmpty().withMessage('Required fields are missing.'),
  body('stockQuantity').exists().withMessage('Required fields are missing.')
];
