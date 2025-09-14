// backend/src/controllers/event.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const trackEvent = async (req: Request, res: Response) => {
  const { variantId, type, sessionId, metadata, url, userAgent, country } = req.body;
  const apiKey = req.headers['x-api-key'] as string;

  if (!variantId || !type || !apiKey) {
    return res.status(400).json({ error: 'Missing variantId, type, or x-api-key header.' });
  }

  try {
    // 1. Find the ApiKey to get the teamId
    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey },
    });

    if (!key) {
      return res.status(401).json({ error: 'Invalid API Key.' });
    }

    // 2. Find the Variant and its parent Experiment
    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
      include: { experiment: true },
    });

    if (!variant) {
      return res.status(404).json({ error: 'Variant not found.' });
    }

    // 3. CRITICAL SECURITY CHECK: Ensure the API key's team matches the experiment's team
    if (key.teamId !== variant.experiment.teamId) {
      return res.status(403).json({ error: 'API Key does not have permission for this experiment.' });
    }

    // 4. Use a transaction to create the event AND update the counter on the correct experiment
    await prisma.$transaction([
      prisma.event.create({
        data: {
          variantId,
          type,
          sessionId: sessionId || 'unknown',
          metadata,
          url,
          userAgent,
          country,
        },
      }),
      prisma.experiment.update({
        where: { id: variant.experiment.id },
        data: { totalEvents: { increment: 1 } },
      }),
    ]);
    
    // For tracking endpoints, respond quickly with a success status.
    res.status(202).json({ message: 'Event tracked successfully.' });

  } catch (error) {
    console.error("Event tracking failed:", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
