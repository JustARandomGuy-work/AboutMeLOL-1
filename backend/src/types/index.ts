export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  bio: string;
  avatarUrl: string;
  backgroundUrl: string;
  themeColor: string;
  badgeTextGlow: boolean;
  badgeAnimation: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Link {
  id: string;
  profileId: string;
  title: string;
  url: string;
  iconType: string;
  position: number;
  createdAt: Date;
}

export interface Cosmetic {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  previewUrl: string;
  createdAt: Date;
}

export interface UserCosmetic {
  id: string;
  userId: string;
  cosmeticId: string;
  purchasedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  paypalTransactionId: string;
  cosmeticId: string;
  amount: number;
  status: string;
  createdAt: Date;
}

export interface Analytics {
  id: string;
  profileId: string;
  visitDate: Date;
  visitCount: number;
  clickCount: number;
  visitorIp: string;
  createdAt: Date;
}

export interface JWTPayload {
  id: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export interface AuthResponse {
  id: string;
  email: string;
  username: string;
  token: string;
  refreshToken: string;
}
