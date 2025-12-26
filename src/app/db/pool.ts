import { Pool } from "pg";

const connectionString = process.env.SUPABASE_DB_URL;
const schema = process.env.SUPABASE_SCHEMA || "public";

if (!connectionString) {
  throw new Error("Missing SUPABASE_DB_URL environment variable");
}

export const pool = new Pool({ connectionString });

// Ensure we always use the intended schema
pool.on("connect", (client) => {
  client.query(`set search_path to ${schema}`);
});
