import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import appConfig from "./app_configs";
import { logger } from "@/utils/logger/logger";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({
  host: appConfig.DB_HOST,
  port: Number(appConfig.DB_PORT),
  database: appConfig.BLOG_DB,
  user: appConfig.DB_USER,
  password: appConfig.DB_PASSWORD,
  max: 5,
});

const adapter = new PrismaPg(pool);

export const db = new PrismaClient({ adapter });

export async function connectToDB() {
  try {
    await db.$connect();
    logger.info("[database]: connected!");
  } catch (err) {
    console.log("[database]: connection error: ", err);
    await db.$disconnect();
  }
}
