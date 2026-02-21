"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.getByEmailRules = exports.updateUserRules = exports.createUserRules = void 0;
const express_validator_1 = require("express-validator");
const ApiError_1 = require("../../utils/ApiError");
const createUserRules = () => [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').trim().isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('phone').optional().trim(),
    (0, express_validator_1.body)('role').optional().isIn(['rider', 'driver', 'admin']).withMessage('Invalid role'),
    (0, express_validator_1.body)('photoURL').optional().trim().isURL().withMessage('photoURL must be a valid URL'),
];
exports.createUserRules = createUserRules;
const updateUserRules = () => [
    (0, express_validator_1.body)('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('phone').optional().trim(),
    (0, express_validator_1.body)('photoURL').optional().trim().isURL().withMessage('photoURL must be a valid URL'),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'suspended', 'deleted']).withMessage('Invalid status'),
];
exports.updateUserRules = updateUserRules;
const getByEmailRules = () => [
    (0, express_validator_1.param)('email').trim().isEmail().withMessage('Valid email is required'),
];
exports.getByEmailRules = getByEmailRules;
const validate = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const message = errors.array().map((e) => e.msg).join('; ');
    next(new ApiError_1.ApiError(400, message));
};
exports.validate = validate;
//# sourceMappingURL=user.validation.js.map