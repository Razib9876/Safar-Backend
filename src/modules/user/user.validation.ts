import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError';

export const createUserRules = () => [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('role').optional().isIn(['rider', 'driver', 'admin']).withMessage('Invalid role'),
  body('photoURL').optional().trim().isURL().withMessage('photoURL must be a valid URL'),
];

export const updateUserRules = () => [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().trim(),
  body('photoURL').optional().trim().isURL().withMessage('photoURL must be a valid URL'),
  body('status').optional().isIn(['active', 'suspended', 'deleted']).withMessage('Invalid status'),
];

export const getByEmailRules = () => [
  param('email').trim().isEmail().withMessage('Valid email is required'),
];

export const validate = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const message = errors.array().map((e) => e.msg).join('; ');
  next(new ApiError(400, message));
};
