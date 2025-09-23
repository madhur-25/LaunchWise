import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware'; // Import our custom request with user info

const prisma = new PrismaClient();

// --- CREATE ---
// This function is now secure and uses the authenticated user's teamId.
export const createExperiment = async (req: AuthRequest, res: Response) => {
  const { name, description, variants } = req.body;
  
  // Get the teamId from the user's token, which was added by our 'protect' middleware.
  const teamId = req.user?.teamId;

  if (!teamId) {
    return res.status(401).json({ error: 'Authorization error: Team ID missing from token.' });
  }

  try {
    // Before creating an experiment, we must find a valid API key for that team.
    const apiKey = await prisma.apiKey.findFirst({
      where: { teamId: teamId },
    });

    if (!apiKey) {
      return res.status(400).json({ error: 'No API key found for this team. Please create one first.' });
    }

    const newExperiment = await prisma.experiment.create({
      data: {
        name,
        description,
        teamId: teamId,       // Use the secure ID from the token
        apiKeyId: apiKey.id,  // Use the ID of the key we found
        variants: {
          create: variants, // Prisma handles creating the variants in a transaction
        },
      },
      include: {
        variants: true,
      },
    });

    res.status(201).json(newExperiment);
  } catch (error) {
    console.error("Failed to create experiment:", error);
    res.status(500).json({ error: "Unable to create experiment." });
  }
};


// --- READ ---
// This function is now secure and only returns experiments for the user's team.
export const getAllExperiments = async (req: AuthRequest, res: Response) => {
  const teamId = req.user?.teamId;

  if (!teamId) {
    return res.status(401).json({ error: 'Authorization error: Team ID missing from token.' });
  }

  try {
    const experiments = await prisma.experiment.findMany({
      where: { teamId: teamId }, // Filter by the user's team
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
// This function is now secure and will only update an experiment if it belongs to the user's team.
export const updateExperiment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, status } = req.body;
  const teamId = req.user?.teamId;

  try {
    const updatedExperiment = await prisma.experiment.update({
      // The where clause now checks BOTH the experiment ID and the team ID.
      // This is a crucial security check.
      where: { id: id, teamId: teamId },
      data: { name, description, status },
    });
    res.status(200).json(updatedExperiment);
  } catch (error) {
    console.error("Failed to update experiment:", error);
    // If the record is not found (because the ID is wrong OR it belongs to another team), Prisma throws an error.
    res.status(404).json({ error: "Experiment not found or you do not have permission to update it." });
  }
};

// --- DELETE ---
// This function is now secure and will only delete an experiment if it belongs to the user's team.
export const deleteExperiment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const teamId = req.user?.teamId;

  try {
    await prisma.experiment.delete({
      // The where clause now checks BOTH the experiment ID and the team ID.
      where: { id: id, teamId: teamId },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete experiment:", error);
    res.status(404).json({ error: "Experiment not found or you do not have permission to delete it." });
  }
};

