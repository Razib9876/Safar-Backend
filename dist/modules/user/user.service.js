"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = exports.updateUser = exports.getOrCreateByEmail = exports.findUserByEmail = exports.findUserById = exports.createUser = void 0;
const user_model_1 = require("./user.model");
const createUser = async (data) => {
    const existing = await user_model_1.User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
        return existing;
    }
    const user = await user_model_1.User.create({
        ...data,
        email: data.email.toLowerCase(),
        role: data.role || 'rider',
        status: 'active',
    });
    return user;
};
exports.createUser = createUser;
const findUserById = async (id) => {
    return user_model_1.User.findById(id);
};
exports.findUserById = findUserById;
const findUserByEmail = async (email) => {
    return user_model_1.User.findOne({ email: email.toLowerCase() });
};
exports.findUserByEmail = findUserByEmail;
const getOrCreateByEmail = async (data) => {
    const existing = await (0, exports.findUserByEmail)(data.email);
    if (existing)
        return existing;
    return (0, exports.createUser)(data);
};
exports.getOrCreateByEmail = getOrCreateByEmail;
const updateUser = async (id, data) => {
    const user = await user_model_1.User.findByIdAndUpdate(id, { $set: data }, { new: true });
    return user;
};
exports.updateUser = updateUser;
const listUsers = async (query) => {
    const filter = {};
    if (query.role)
        filter.role = query.role;
    if (query.status)
        filter.status = query.status;
    return user_model_1.User.find(filter).sort({ createdAt: -1 });
};
exports.listUsers = listUsers;
//# sourceMappingURL=user.service.js.map