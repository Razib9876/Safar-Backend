"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const db_1 = require("./config/db");
const start = async () => {
    try {
        await (0, db_1.connectDb)();
        console.log("✅ Database connected");
        const PORT = process.env.PORT || config_1.config.port || 5000;
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map