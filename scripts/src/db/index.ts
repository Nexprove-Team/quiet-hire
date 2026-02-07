import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

let client: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDB(connectionUrl?: string) {
  if (db) return db;

  const url = connectionUrl ?? process.env["SCRAPER_DATABASE_URL"];
  if (!url) {
    throw new Error(
      "SCRAPER_DATABASE_URL is not defined. Pass it as argument or set as env variable."
    );
  }

  client = postgres(url);
  db = drizzle(client, { schema });
  return db;
}

export async function closeDB() {
  if (client) {
    await client.end();
    client = null;
    db = null;
  }
}

export { schema };
export type DB = ReturnType<typeof getDB>;
