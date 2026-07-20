import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");

    const schema = await readFile(schemaPath, "utf8");

    await pool.query(schema);

    console.log("Migration completed successfully");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrate();
