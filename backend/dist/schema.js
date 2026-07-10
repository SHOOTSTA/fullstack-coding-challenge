"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceInputSchema = void 0;
const zod_1 = require("zod");
exports.serviceInputSchema = zod_1.z.object({
    type: zod_1.z.enum(['ambulance', 'doctor']),
    title: zod_1.z.string().trim().min(1, 'Title is required').max(120),
    description: zod_1.z.string().trim().min(1, 'Description is required').max(1000),
    location: zod_1.z.string().trim().min(1, 'Location is required').max(200),
    imageUrl: zod_1.z.string().trim().min(1).max(500).nullable().optional().or(zod_1.z.literal('')),
    lat: zod_1.z.number().min(-90).max(90).nullable().optional(),
    lng: zod_1.z.number().min(-180).max(180).nullable().optional(),
});
//# sourceMappingURL=schema.js.map