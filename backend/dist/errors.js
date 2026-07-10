"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    status;
    issues;
    constructor(status, message, issues) {
        super(message);
        this.name = 'AppError';
        this.status = status;
        this.issues = issues;
    }
}
exports.AppError = AppError;
//# sourceMappingURL=errors.js.map