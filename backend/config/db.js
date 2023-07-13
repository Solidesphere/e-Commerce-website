import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

export const pool = new pg.Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABSE,
  password: process.env.PASSWORD,
  port: process.env.DATABASE_PORT,
});

const prisma = new PrismaClient();
export default prisma;
