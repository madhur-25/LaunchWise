// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response) => {
  // 1. Extract user and team data from the request body
  const { email, name, teamName } = req.body;

  // 2. Basic validation to ensure all required fields are present
  if (!email || !name || !teamName) {
    return res.status(400).json({ error: 'Email, name, and teamName are required.' });
  }

  try {
    // 3. Use a Prisma transaction to ensure both records are created or neither is.
    // This is an atomic operation.
    const result = await prisma.$transaction(async (prisma) => {
      // First, create the team
      const newTeam = await prisma.team.create({
        data: {
          name: teamName,
        },
      });

      // Then, create the user and link them to the new team
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          role: 'OWNER', // The first user is always the OWNER
          teamId: newTeam.id,
        },
      });

      return { newUser, newTeam };
    });

    // 4. Send a success response with the created user and team
    res.status(201).json(result);

  } catch (error: any) {
    // Handle potential errors, like a user with that email already existing
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }
    console.error("Sign-up failed:", error);
    res.status(500).json({ error: 'Unable to create user and team.' });
  }
};
