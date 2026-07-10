"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDbPath = exports.Store = exports.NotFoundError = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const SEED_PATH = path_1.default.join(__dirname, 'data', 'seed.json');
class NotFoundError extends Error {
    constructor(message = 'Service not found') {
        super(message);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class Store {
    dbPath;
    records;
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.records = this.load();
    }
    load() {
        if (!fs_1.default.existsSync(this.dbPath)) {
            const seed = JSON.parse(fs_1.default.readFileSync(SEED_PATH, 'utf-8'));
            fs_1.default.mkdirSync(path_1.default.dirname(this.dbPath), { recursive: true });
            fs_1.default.writeFileSync(this.dbPath, JSON.stringify(seed, null, 2));
            return seed;
        }
        return JSON.parse(fs_1.default.readFileSync(this.dbPath, 'utf-8'));
    }
    persist() {
        fs_1.default.writeFileSync(this.dbPath, JSON.stringify(this.records, null, 2));
    }
    list(params) {
        const { type, q } = params;
        const page = Math.max(1, Math.floor(params.page) || 1);
        const limit = Math.max(1, Math.floor(params.limit) || 10);
        const byType = (t) => this.records.filter((r) => r.type === t).length;
        let filtered = this.records;
        if (type) {
            filtered = filtered.filter((r) => r.type === type);
        }
        if (q && q.trim()) {
            const needle = q.trim().toLowerCase();
            filtered = filtered.filter((r) => r.title.toLowerCase().includes(needle) ||
                r.description.toLowerCase().includes(needle) ||
                r.location.toLowerCase().includes(needle));
        }
        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const start = (page - 1) * limit;
        const data = filtered.slice(start, start + limit);
        return {
            data,
            page,
            limit,
            total,
            totalPages,
            totals: {
                all: this.records.length,
                ambulance: byType('ambulance'),
                doctor: byType('doctor'),
            },
        };
    }
    getById(id) {
        const found = this.records.find((r) => r.id === id);
        if (!found)
            throw new NotFoundError();
        return found;
    }
    create(input) {
        const now = new Date().toISOString();
        const service = {
            id: crypto_1.default.randomUUID(),
            type: input.type,
            title: input.title,
            description: input.description,
            location: input.location,
            imageUrl: input.imageUrl ?? null,
            lat: input.lat ?? null,
            lng: input.lng ?? null,
            createdAt: now,
            updatedAt: now,
        };
        this.records.push(service);
        this.persist();
        return service;
    }
    update(id, input) {
        const index = this.records.findIndex((r) => r.id === id);
        if (index === -1)
            throw new NotFoundError();
        const existing = this.records[index];
        const updated = {
            ...existing,
            type: input.type,
            title: input.title,
            description: input.description,
            location: input.location,
            imageUrl: input.imageUrl ?? null,
            lat: input.lat ?? null,
            lng: input.lng ?? null,
            updatedAt: new Date().toISOString(),
        };
        this.records[index] = updated;
        this.persist();
        return updated;
    }
    remove(id) {
        const index = this.records.findIndex((r) => r.id === id);
        if (index === -1)
            throw new NotFoundError();
        this.records.splice(index, 1);
        this.persist();
    }
}
exports.Store = Store;
exports.defaultDbPath = path_1.default.join(__dirname, 'data', 'db.json');
//# sourceMappingURL=store.js.map