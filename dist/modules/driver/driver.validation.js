"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.userIdParamRules = exports.idParamRules = exports.updateDriverRules = exports.createDriverRules = void 0;
const express_validator_1 = require("express-validator");
const ApiError_1 = require("../../utils/ApiError");
const createDriverRules = () => [
    (0, express_validator_1.body)('userId').isMongoId().withMessage('Valid userId is required'),
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
    (0, express_validator_1.body)('photo').optional().trim(),
    (0, express_validator_1.body)('vehicleDetails').isObject().withMessage('vehicleDetails is required'),
    (0, express_validator_1.body)('vehicleDetails.type').trim().notEmpty().withMessage('Vehicle type is required'),
    (0, express_validator_1.body)('vehicleDetails.model').optional().trim(),
    (0, express_validator_1.body)('vehicleDetails.registrationNumber').optional().trim(),
    (0, express_validator_1.body)('vehicleDetails.capacity').optional().isInt({ min: 1 }),
];
exports.createDriverRules = createDriverRules;
const updateDriverRules = () => [
    (0, express_validator_1.body)('name').optional().trim().notEmpty(),
    (0, express_validator_1.body)('phoneNumber').optional().trim().notEmpty(),
    (0, express_validator_1.body)('photo').optional().trim(),
    (0, express_validator_1.body)('status').optional().isIn(['pending', 'approved', 'rejected', 'suspended']),
    (0, express_validator_1.body)('approvedByAdmin').optional().isBoolean(),
    (0, express_validator_1.body)('vehicleDetails').optional().isObject(),
    (0, express_validator_1.body)('vehicleDetails.type').optional().trim().notEmpty(),
    (0, express_validator_1.body)('vehicleDetails.model').optional().trim(),
    (0, express_validator_1.body)('vehicleDetails.registrationNumber').optional().trim(),
    (0, express_validator_1.body)('vehicleDetails.capacity').optional().isInt({ min: 1 }),
];
exports.updateDriverRules = updateDriverRules;
const idParamRules = () => [(0, express_validator_1.param)('id').isMongoId().withMessage('Valid id is required')];
exports.idParamRules = idParamRules;
const userIdParamRules = () => [
    (0, express_validator_1.param)('userId').isMongoId().withMessage('Valid userId is required'),
];
exports.userIdParamRules = userIdParamRules;
const validate = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty())
        return next();
    const message = errors.array().map((e) => e.msg).join('; ');
    next(new ApiError_1.ApiError(400, message));
};
exports.validate = validate;
//# sourceMappingURL=driver.validation.js.map