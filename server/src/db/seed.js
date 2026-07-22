import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

async function seed() {
  try {
    // Insert event statuses
    await pool.query(`
      INSERT INTO event_status(name)
      VALUES
      ('Draft'),
      ('Published')
      ON CONFLICT DO NOTHING;
    `);

    // Insert enquiry types
    await pool.query(`
      INSERT INTO enquiry_types(name, display_order)
      VALUES
      ('General Enquiry',1),
      ('Sponsorship',2),
      ('Partnership',3)
      ON CONFLICT DO NOTHING;
    `);

    // Create admin user
    const passwordHash = await bcrypt.hash("123456", 10);

    await pool.query(
      `
      INSERT INTO admins
      (
        username,
        password_hash
      )
      VALUES
      ($1,$2)
      ON CONFLICT(username)
      DO NOTHING;
      `,
      ["admin", passwordHash],
    );

    console.log("Seed completed");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await pool.end();
  }
}

seed();
