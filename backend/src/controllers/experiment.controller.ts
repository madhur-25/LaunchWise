// backend/src/controllers/experiment.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CRITICAL LINE: Make sure 'export' is here
export const getAllExperiments = async (req: Request, res: Response) => {
  try {
    const experiments = await prisma.experiment.findMany({
      include: {
        variants: true,
      },
    });
    res.status(200).json(experiments);
  } catch (error) {
    console.error("Failed to fetch experiments:", error);
    res.status(500).json({ error: "Unable to fetch experiments." });
  }
};