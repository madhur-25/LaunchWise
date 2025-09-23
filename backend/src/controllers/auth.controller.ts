import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response) => {
  const { email, name, teamName, password } = req.body;

  if (!email || !name || !teamName || !password) {
    return res.status(400).json({ error: 'Email, name, teamName, and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const newTeam = await tx.team.create({
        data: { name: teamName },
      });

      const newUser = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          teamId: newTeam.id,
          role: 'OWNER',
        },
      });

      const { password, ...userWithoutPassword } = newUser;
      return { newUser: userWithoutPassword, newTeam };
    });

    return res.status(201).json(result);
  } catch (error: any) {
    console.error("Sign-up failed:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }
    return res.status(500).json({ error: 'Unable to create user and team.' });
  }
};

// --- LOGIN FUNCTION ---
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // 1. Create the "payload" - the information we want to store in the token.
    const tokenPayload = {
      userId: user.id,
      teamId: user.teamId,
      role: user.role,
    };

    // 2. Sign the token using your secret key from the .env file.
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET as string, // This reads your secret key
      { expiresIn: '7d' } //  make the token valid for 7 days
    );

    // 3. Send the token and user info back to the client.
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({ 
      message: "Login successful!", 
      token, 
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
};

