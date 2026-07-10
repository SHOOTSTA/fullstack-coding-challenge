"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const store_1 = require("./store");
const services_1 = require("./routes/services");
const errors_1 = require("./errors");
function createApp(dbPath) {
    const app = (0, express_1.default)();
    const store = new store_1.Store(dbPath);
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use('/images', express_1.default.static(path_1.default.join(__dirname, '..', 'public', 'images')));
    app.get('/health', (_req, res) => res.json({ status: 'ok' }));
    app.use('/api/services', (0, services_1.createServicesRouter)(store));
    app.use((_req, res) => {
        res.status(404).json({ message: 'Not found' });
    });
    app.use((err, _req, res, _next) => {
        if (err instanceof errors_1.AppError) {
            res.status(err.status).json({ message: err.message, issues: err.issues });
            return;
        }
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    });
    return app;
}
//# sourceMappingURL=app.js.map