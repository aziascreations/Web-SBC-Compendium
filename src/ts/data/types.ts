import {z} from "../external/zod/src/index";

export const linkSchema = z.object({
    title: z.string(),
    url: z.string(),
    official: z.boolean().optional().default(false),
    store: z.boolean().optional().default(false),
    wiki: z.boolean().optional().default(false),
});

export const authorSchema = z.object({
    name: z.string(),
    url: z.string().optional().nullable(),
});

export const attributionSchema = z.object({
    author: z.string(),
    license: z.string(),
});

export const imageSchema = z.object({
    url: z.string(),
    description: z.string().optional().nullable(),
    attribution: attributionSchema,
});

export const cpuCacheLayerSchema = z.object({
    min: z.number(),
    max: z.number(),
    note: z.string().optional().nullable(),
});

export const cpuCacheSchema = z.object({
    l1: cpuCacheLayerSchema.optional().nullable().default(null),
    l2: cpuCacheLayerSchema.optional().nullable().default(null),
    l3: cpuCacheLayerSchema.optional().nullable().default(null),
});

export const cpuSchema = z.object({
    name: z.string(),
    launch: z.string(),
    designer: z.string(),
    micro_architecture: z.string(),
    caches: cpuCacheSchema,
    links: linkSchema.array(),
});

export const socCpuSchema = z.object({
    id: z.string(),
    count: z.number(),
});

export const socSchema = z.object({
    name: z.string(),
    manufacturer: z.string(),
    cpus: socCpuSchema.array(),
    links: linkSchema.array(),
    picture: imageSchema,
});

export const manufacturerSchema = z.object({
    name: z.string(),
    links: linkSchema.array(),
    logo: imageSchema,
});

export const sbcVariantRamSchema = z.object({
    capacity: z.number(),
    type: z.string(),
});

export const sbcVariantSchema = z.object({
    // Parent variant on which this and all variants of a given SBC may be based.
    //private readonly commonVariant: SbcVariant | null;
    
    links: linkSchema.array().optional().default([]),
    ram: sbcVariantRamSchema.optional().nullable(),
    remarks: z.string().array().optional().default([]),
    pictures: imageSchema.array(),
});

export const sbcSchema = z.object({
    name: z.string(),
    manufacturer: z.string(),
    
    //commonVariant: sbcVariantSchema.optional().nullable(),
    
    variants: z.map(z.string(), sbcVariantSchema),
    picture: imageSchema,
});

export const licenseSchema = z.object({
    name: z.string(),
    link: linkSchema,
});

export const rootSchema = z.object({
    cpu: z.map(z.string(), cpuSchema),
    manufacturer: z.map(z.string(), manufacturerSchema),
    sbc: z.map(z.string(), sbcSchema),
    soc: z.map(z.string(), socSchema),
    license: z.map(z.string(), licenseSchema),
    author: z.map(z.string(), authorSchema),
    version: z.number(),
});

export type linkType = z.infer<typeof linkSchema>;
export type authorType = z.infer<typeof authorSchema>;
export type attributionType = z.infer<typeof attributionSchema>;
export type imageType = z.infer<typeof imageSchema>;
export type cpuCacheLayerType = z.infer<typeof cpuCacheLayerSchema>;
export type cpuCacheType = z.infer<typeof cpuCacheSchema>;
export type cpuType = z.infer<typeof cpuSchema>;
export type socCpuType = z.infer<typeof socCpuSchema>;
export type socType = z.infer<typeof socSchema>;
export type manufacturerType = z.infer<typeof manufacturerSchema>;
export type sbcVariantRamType = z.infer<typeof sbcVariantRamSchema>;
export type sbcVariantType = z.infer<typeof sbcVariantSchema>;
export type sbcType = z.infer<typeof sbcSchema>;
export type licenseType = z.infer<typeof licenseSchema>;
export type rootType = z.infer<typeof rootSchema>;
