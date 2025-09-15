import { z } from 'zod';

// Schema for creating a new experiment
export const createExperimentSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Experiment name is required" }),
    description: z.string().optional(),
    teamId: z.string().cuid({ message: "Invalid Team ID" }),
    apiKeyId: z.string().cuid({ message: "Invalid API Key ID" }),
    variants: z.array(
      z.object({
        name: z.string().min(1, { message: "Variant name is required" }),
        isControl: z.boolean(),
        trafficSplit: z.number().min(0).max(1),
      })
    ).min(2, { message: "At least two variants are required" }),
  }),
});

// Schema for updating an experiment
export const updateExperimentSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    status: z.enum(['DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED']).optional(),
  }),
  params: z.object({
    id: z.string().cuid({ message: "Invalid Experiment ID" }),
  }),
});
