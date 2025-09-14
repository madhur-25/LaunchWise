// backend/src/controllers/experiment.controller.ts
import { Request, Response } from 'express';
import { PrismaClient, Variant } from '@prisma/client';

const prisma = new PrismaClient();

// --- CREATE ---
export const createExperiment = async (req: Request, res: Response) => {
  const { name, description, variants, teamId, apiKeyId } = req.body;

  // Basic validation
  if (!name || !variants || !teamId || !apiKeyId || variants.length < 2) {
    return res.status(400).json({ error: 'Missing required fields or must have at least two variants.' });
  }

  try {
    // Use a transaction to ensure experiment and variants are created together
    const newExperiment = await prisma.experiment.create({
      data: {
        name,
        description,
        teamId,
        apiKeyId,
        variants: {
          createMany: {
            data: variants.map((v: Partial<Variant>) => ({
              name: v.name || '',
              trafficSplit: v.trafficSplit || 0.5,
              isControl: v.isControl || false,
            })),
          },
        },
      },
      include: {
        variants: true, // Include the created variants in the response
      },
    });

    res.status(201).json(newExperiment);
  } catch (error) {
    console.error("Failed to create experiment:", error);
    res.status(500).json({ error: "Unable to create experiment." });
  }
};


// --- READ (Existing Function) ---
export const getAllExperiments = async (req: Request, res: Response) => {
  try {
    const experiments = await prisma.experiment.findMany({
      include: {
        variants: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    res.status(200).json(experiments);
  } catch (error) {
    console.error("Failed to fetch experiments:", error);
    res.status(500).json({ error: "Unable to fetch experiments." });
  }
};

// --- UPDATE ---
export const updateExperiment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, status } = req.body;

    try {
        const updatedExperiment = await prisma.experiment.update({
            where: { id },
            data: { name, description, status },
        });
        res.status(200).json(updatedExperiment);
    } catch (error) {
        console.error("Failed to update experiment:", error);
        res.status(404).json({ error: "Experiment not found or failed to update." });
    }
};

// --- DELETE ---
export const deleteExperiment = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.experiment.delete({
            where: { id },
        });
        // onDelete: Cascade in the schema handles deleting child variants and events automatically.
        res.status(204).send(); // 204 No Content is standard for a successful delete
    } catch (error) {
        console.error("Failed to delete experiment:", error);
        res.status(404).json({ error: "Experiment not found." });
    }
};
