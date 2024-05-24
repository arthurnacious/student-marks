import { dbCredentials } from "@/db";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "mysql", // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: dbCredentials,
});
