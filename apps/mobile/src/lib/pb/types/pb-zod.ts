import { z } from 'zod';


// Base schemas for common PocketBase fields
const baseResponseSchema = z.object({
    id: z.string(),
    created: z.string(),
    updated: z.string(),
    collectionId: z.string(),
    collectionName: z.string(),
});

const baseCreateSchema = z.object({
    id: z.string().optional(),
});

const baseUpdateSchema = z.object({});

const authResponseSchema = baseResponseSchema.extend({
    username: z.string(),
    email: z.string(),
    tokenKey: z.string().optional(),
    emailVisibility: z.boolean(),
    verified: z.boolean(),
});

const authCreateSchema = baseCreateSchema.extend({
    username: z.string().optional(),
    email: z.string().optional(),
    emailVisibility: z.boolean().optional(),
    password: z.string(),
    passwordConfirm: z.string(),
    verified: z.boolean().optional(),
});

const authUpdateSchema = z.object({
    username: z.string().optional(),
    email: z.string().optional(),
    emailVisibility: z.boolean().optional(),
    oldPassword: z.string().optional(),
    password: z.string().optional(),
    passwordConfirm: z.string().optional(),
    verified: z.boolean().optional(),
});

// ===== wards_admin =====

export const WardsAdminResponseZodSchema = authResponseSchema.extend({
    collectionName: z.literal('wards_admin'),
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    created: z.string().optional(),
    updated: z.string().optional()
});

export const WardsAdminCreateZodSchema = authCreateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/).optional(),
    email: z.email(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

export const WardsAdminUpdateZodSchema = authUpdateSchema.extend({
    id: z.string().min(15).max(15).regex(/^[a-z0-9]+$/),
    email: z.email().optional(),
    emailVisibility: z.boolean().optional(),
    verified: z.boolean().optional(),
    created: z.union([z.string(), z.date()]).optional(),
    updated: z.union([z.string(), z.date()]).optional()
});

// ===== wards_events =====

export const WardsEventsResponseZodSchema = baseResponseSchema.extend({
    collectionName: z.literal('wards_events'),
    id: z.string().regex(/^[a-z0-9]+$/).optional(),
    event_type: z.enum(['INSERT', 'UPDATE', 'DELETE']),
    ward_id: z.number().optional(),
    client_id: z.string().optional(),
    client_event_id: z.string().optional(),
    approved: z.boolean().optional(),
    old_data: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    new_data: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional()
});

export const WardsEventsCreateZodSchema = baseCreateSchema.extend({
    id: z.string().regex(/^[a-z0-9]+$/).optional(),
    event_type: z.enum(['INSERT', 'UPDATE', 'DELETE']),
    ward_id: z.number().optional(),
    client_id: z.string().optional(),
    client_event_id: z.string().optional(),
    approved: z.boolean().optional(),
    old_data: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    new_data: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional()
});

export const WardsEventsUpdateZodSchema = baseUpdateSchema.extend({
    id: z.string().regex(/^[a-z0-9]+$/),
    event_type: z.enum(['INSERT', 'UPDATE', 'DELETE']).optional(),
    ward_id: z.number().optional(),
    'ward_id+': z.number().optional(),
    'ward_id-': z.number().optional(),
    client_id: z.string().optional(),
    client_event_id: z.string().optional(),
    approved: z.boolean().optional(),
    old_data: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    new_data: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional()
});

// ===== wards_updates =====

export const WardsUpdatesResponseZodSchema = baseResponseSchema.extend({
    collectionName: z.literal('wards_updates'),
    id: z.string().regex(/^[a-z0-9]+$/).optional(),
    version: z.number(),
    created_by: z.string().optional(),
    description: z.string().optional(),
    ready: z.boolean().optional(),
    data: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    updated: z.string().optional(),
    created: z.string().optional()
});

export const WardsUpdatesCreateZodSchema = baseCreateSchema.extend({
    id: z.string().regex(/^[a-z0-9]+$/).optional(),
    version: z.number(),
    created_by: z.string().optional(),
    description: z.string().optional(),
    ready: z.boolean().optional(),
    data: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    updated: z.union([z.string(), z.date()]).optional(),
    created: z.union([z.string(), z.date()]).optional()
});

export const WardsUpdatesUpdateZodSchema = baseUpdateSchema.extend({
    id: z.string().regex(/^[a-z0-9]+$/),
    version: z.number().optional(),
    'version+': z.number().optional(),
    'version-': z.number().optional(),
    created_by: z.string().optional(),
    description: z.string().optional(),
    ready: z.boolean().optional(),
    data: z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()]).optional(),
    updated: z.union([z.string(), z.date()]).optional(),
    created: z.union([z.string(), z.date()]).optional()
});


// Export all schemas
export const schemas = {
    wards_admin: {
        response: WardsAdminResponseZodSchema,
        create: WardsAdminCreateZodSchema,
        update: WardsAdminUpdateZodSchema,
    },
    wards_events: {
        response: WardsEventsResponseZodSchema,
        create: WardsEventsCreateZodSchema,
        update: WardsEventsUpdateZodSchema,
    },
    wards_updates: {
        response: WardsUpdatesResponseZodSchema,
        create: WardsUpdatesCreateZodSchema,
        update: WardsUpdatesUpdateZodSchema,
    },
};

export type Schemas = typeof schemas;

// Validation helpers
// Validation helpers for wards_admin
export const wards_adminValidators = {
    response: (data: unknown) => WardsAdminResponseZodSchema.parse(data),
    safeResponse: (data: unknown) => WardsAdminResponseZodSchema.safeParse(data),
    create: (data: unknown) => WardsAdminCreateZodSchema.parse(data),
    safeCreate: (data: unknown) => WardsAdminCreateZodSchema.safeParse(data),
    update: (data: unknown) => WardsAdminUpdateZodSchema.parse(data),
    safeUpdate: (data: unknown) => WardsAdminUpdateZodSchema.safeParse(data),
};

// Type inference helpers for wards_admin
export type WardsAdminResponseZod = z.infer<typeof WardsAdminResponseZodSchema>;
export type WardsAdminCreateZod = z.infer<typeof WardsAdminCreateZodSchema>;
export type WardsAdminUpdateZod = z.infer<typeof WardsAdminUpdateZodSchema>;

// Validation helpers for wards_events
export const wards_eventsValidators = {
    response: (data: unknown) => WardsEventsResponseZodSchema.parse(data),
    safeResponse: (data: unknown) => WardsEventsResponseZodSchema.safeParse(data),
    create: (data: unknown) => WardsEventsCreateZodSchema.parse(data),
    safeCreate: (data: unknown) => WardsEventsCreateZodSchema.safeParse(data),
    update: (data: unknown) => WardsEventsUpdateZodSchema.parse(data),
    safeUpdate: (data: unknown) => WardsEventsUpdateZodSchema.safeParse(data),
};

// Type inference helpers for wards_events
export type WardsEventsResponseZod = z.infer<typeof WardsEventsResponseZodSchema>;
export type WardsEventsCreateZod = z.infer<typeof WardsEventsCreateZodSchema>;
export type WardsEventsUpdateZod = z.infer<typeof WardsEventsUpdateZodSchema>;

// Validation helpers for wards_updates
export const wards_updatesValidators = {
    response: (data: unknown) => WardsUpdatesResponseZodSchema.parse(data),
    safeResponse: (data: unknown) => WardsUpdatesResponseZodSchema.safeParse(data),
    create: (data: unknown) => WardsUpdatesCreateZodSchema.parse(data),
    safeCreate: (data: unknown) => WardsUpdatesCreateZodSchema.safeParse(data),
    update: (data: unknown) => WardsUpdatesUpdateZodSchema.parse(data),
    safeUpdate: (data: unknown) => WardsUpdatesUpdateZodSchema.safeParse(data),
};

// Type inference helpers for wards_updates
export type WardsUpdatesResponseZod = z.infer<typeof WardsUpdatesResponseZodSchema>;
export type WardsUpdatesCreateZod = z.infer<typeof WardsUpdatesCreateZodSchema>;
export type WardsUpdatesUpdateZod = z.infer<typeof WardsUpdatesUpdateZodSchema>;