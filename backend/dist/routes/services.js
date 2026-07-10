"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServicesRouter = createServicesRouter;
const express_1 = require("express");
const store_1 = require("../store");
const schema_1 = require("../schema");
const errors_1 = require("../errors");
const VALID_TYPES = ['ambulance', 'doctor'];
function createServicesRouter(store) {
    const router = (0, express_1.Router)();
    router.get('/', (req, res) => {
        const { type, q, page, limit } = req.query;
        if (type !== undefined && !VALID_TYPES.includes(type)) {
            throw new errors_1.AppError(400, `type must be one of: ${VALID_TYPES.join(', ')}`);
        }
        const result = store.list({
            type: type,
            q: typeof q === 'string' ? q : undefined,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
        });
        res.json(result);
    });
    router.get('/:id', (req, res) => {
        const service = store.getById(req.params.id);
        res.json(service);
    });
    router.post('/', (req, res) => {
        const parsed = schema_1.serviceInputSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new errors_1.AppError(400, 'Validation failed', parsed.error.flatten());
        }
        const service = store.create(parsed.data);
        res.status(201).json(service);
    });
    router.put('/:id', (req, res) => {
        const parsed = schema_1.serviceInputSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new errors_1.AppError(400, 'Validation failed', parsed.error.flatten());
        }
        const service = store.update(req.params.id, parsed.data);
        res.json(service);
    });
    router.delete('/:id', (req, res) => {
        store.remove(req.params.id);
        res.status(204).send();
    });
    // Convert NotFoundError thrown by the store into a 404 without
    // repeating try/catch boilerplate in every handler above.
    router.use((err, _req, _res, next) => {
        if (err instanceof store_1.NotFoundError) {
            next(new errors_1.AppError(404, err.message));
            return;
        }
        next(err);
    });
    return router;
}
//# sourceMappingURL=services.js.map