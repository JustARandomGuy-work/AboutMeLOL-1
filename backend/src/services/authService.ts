import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { AuthResponse } from '../types/index.js';

export class AuthService {
  static async register(email: string, username: string, password: string): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const existingUsername = await db.query.users.findFirst({
      where: eq(users.username, username)
    });

    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.insert(users).values({
      email,
      username,
      passwordHash
    }).returning();

    if (!newUser[0]) {
      throw new Error('Failed to create user');
    }

    const { token, refreshToken } = this.generateTokens(newUser[0].id, email, username);

    return {
      id: newUser[0].id,
      email: newUser[0].email,
      username: newUser[0].username,
      token,
      refreshToken
    };
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const { token, refreshToken } = this.generateTokens(user.id, user.email, user.username);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      token,
      refreshToken
    };
  }

  static generateTokens(id: string, email: string, username: string) {
    const token = jwt.sign(
      { id, email, username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return { token, refreshToken };
  }

  static async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'secret') as any;
      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.id)
      });

      if (!user) {
        throw new Error('User not found');
      }

      const { token, refreshToken: newRefreshToken } = this.generateTokens(user.id, user.email, user.username);

      return { token, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

export default AuthService;
