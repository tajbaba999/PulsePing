import { z } from "zod";
import { HttpMethod, AuthType } from "@/lib/generated/prisma/client";

export const monitorSchema = z.object({
    name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
    url: z.string().url("Must be a valid URL"),
    frequency: z.number().int().min(10, "Frequency must be at least 10 seconds").max(86400, "Frequency must be at most 24 hours"),
    method: z.nativeEnum(HttpMethod).default(HttpMethod.GET),
    expectedStatus: z.number().int().min(100).max(599).default(200),
    authType: z.nativeEnum(AuthType).default(AuthType.NONE),
    authData: z.record(z.any()).optional().nullable(),
    isActive: z.boolean().default(true),
});

export type MonitorInput = z.infer<typeof monitorSchema>;