import dotenv from 'dotenv';

dotenv.config();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const config = {
  port: Number(process.env.SERVER_PORT) || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins
};
