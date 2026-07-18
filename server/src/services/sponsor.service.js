import { pool } from "../config/db.js";

export const createSponsorInquiry = async (data) => {
  const query = `
        INSERT INTO sponsor_inquiries
        (
        name, email, company, enquiry_type_id, message
        )
        VALUES ($1,$2,$3,$4,$5) 
        RETURNING *
    `;

  const values = [
    data.name,
    data.email,
    data.company || null,
    data.enquiry_type_id,
    data.message || null,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getSponsorInquiries = async () => {
  const query = `
       SELECT 
        s.id, s.name,s.email, s.company, s.enquiry_type_id,

        e.name AS enquiry_type,

        s.message, s.status, s.admin_notes,

        s.created_at, s.updated_at
        FROM sponsor_inquiries s
        LEFT JOIN enquiry_types e
        ON s.enquiry_type_id = e.id
        ORDER BY s.created_at DESC
    `;

  const { rows } = await pool.query(query);
  return rows;
};

export const updateSponsorStatus = async (id, status) => {
const query = `
UPDATE sponsor_inquiries 
SET 
 status=$1,
 updated_at = NOW()
WHERE id=$2
RETURNING *
`;

  const { rows } = await pool.query(query, [status, id]);

  return rows[0];
};

export const updateSponsorInquiry = async (id, data) => {
  const query = `
    UPDATE sponsor_inquiries
    SET
      status = $1,
      admin_notes = $2,
      updated_at = NOW()
    WHERE id = $3
    RETURNING *;
  `;

  const values = [data.status, data.admin_notes || null, id];

  const { rows } = await pool.query(query, values);

  if (rows.length === 0) {
    throw new Error("Sponsor inquiry not found");
  }

  return rows[0];
};
