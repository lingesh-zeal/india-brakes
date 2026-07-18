import { pool } from "../config/db.js";

export const getAllEnquiryTypes = async () => {
  const query = `
        SELECT * FROM enquiry_types
        WHERE is_active = TRUE
        ORDER BY display_order ASC;
    `;

  const { rows } = await pool.query(query);
  return rows;
};

export const createEnquiryType = async (name) => {
  const query = `
        INSERT INTO enquiry_types (name, display_order)
        VALUES(
        $1,
        (SELECT COALESCE(MAX(display_order),0) + 1 FROM enquiry_types 
        WHERE is_active = TRUE)
        ) 
        RETURNING *
    `;

  const { rows } = await pool.query(query, [name]);
  return rows[0];
};

export const updateEnquiryType = async (id, name) => {
  const query = `
        UPDATE enquiry_types
        SET name=$1 WHERE id=$2
        RETURNING *
    `;

  const { rows } = await pool.query(query, [name, id]);
  if (rows.length === 0) {
    throw new Error("Enquiry type not found");
  }

  return rows[0];
};

export const deleteEnquiryType = async (id) => {
 const client = await pool.connect();

 try{
  await client.query("BEGIN");

  const {rows}= await client.query(
    `
    SELECT display_order FROM enquiry_types 
    WHERE id=$1 AND is_active =TRUE;
    `, [id]
  );

  if(!rows.length){
    throw new Error("Enquiry type not found");
  }
  const displayOrder = rows[0].display_order;

  await client.query(
    `
    UPDATE enquiry_types SET is_active = FALSE where id=$1
    `,
    [id]
  );

  await client.query(
    `UPDATE enquiry_types SET display_order = display_order - 1
    WHERE is_active = TRUE
    AND display_order > $1;
    `,
    [displayOrder]
  );

  await client.query("COMMIT");
  return {id};
 }catch(error){
  await client.query("ROLLBACK");
  throw error;
 }finally{
  client.release();
 }
};
