import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./prisma/generated/index.js";
import { bearer } from "better-auth/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
  baseURL: process.env.AUTH_BASE_URL,
  secret: process.env.AUTH_SECRET,
  trustedOrigins: ["*"],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  logger: { level: 'debug' },
  emailAndPassword: {
    enabled: true
  },
  plugins: [bearer()]
})
