import { body } from 'express-validator';

export const doctorValidator = [
  body('fullName').trim().notEmpty().withMessage('Required fields are missing.'),
  body('specialization').trim().notEmpty().withMessage('Required fields are missing.'),
  body('qualification').trim().notEmpty().withMessage('Required fields are missing.'),
  body('experienceYears').exists().withMessage('Required fields are missing.'),
  body('profileImageUrl').trim().notEmpty().withMessage('Required fields are missing.'),
  body('consultationFee').exists().withMessage('Required fields are missing.')
];
