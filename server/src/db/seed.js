import { pool } from "../config/db.js";

async function seed() {
  try {
    await pool.query(
      `
      INSERT INTO event_status(name)
VALUES
('Draft'),
('Published')
ON CONFLICT DO NOTHING;


INSERT INTO enquiry_types(name,display_order)
VALUES
('General Enquiry',1),
('Sponsorship',2),
('Partnership',3)
ON CONFLICT DO NOTHING;
      `,
    );
    console.log("Seed completed");
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

seed();