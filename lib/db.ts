import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema";

const client = postgres(process.env.POSTGRES_URL!, {
  max: 1,
  prepare: false,
});

export const db = drizzle(client, { schema });
