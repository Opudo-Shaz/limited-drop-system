import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

 prisma.$connect()
  .then(() => console.log('Prisma connected successfully'))
  .catch(err => console.error('Prisma connection error:', err));
  