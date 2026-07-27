import { pool } from "../config/db.js";

// PUBLIC
export const getActiveMarqueeSponsors = async()=>{
    const result = await pool.query(
        `
        SELECT 
            id, image_url, alt_text
        FROM marquee_sponsors
        WHERE is_active = TRUE
        ORDER BY created_at DESC
        `
    );

    return result.rows;
};

// ADMIN - GET ALL
export const getAllMarqueeSponsors = async()=>{
    const result = await pool.query(
        `
        SELECT 
            id, 
            image_url,
            alt_text,
            is_active, 
            created_at,
            updated_at
        FROM marquee_sponsors
        ORDER BY created_at DESC
        `
    );
    return result.rows;
};

// ADMIN - GET BY ID
export const getMarqueeSponsorById = async (id) => {
  const result = await pool.query(
    `
    SELECT *
    FROM marquee_sponsors
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

// ADMIN - CREATE
export const createMarqueeSponsor = async(data) =>{
    const {image_url, alt_text} = data;

    const result = await pool.query(
        `
        INSERT INTO marquee_sponsors
        (
            image_url, alt_text
        )
        VALUES($1,$2)
        RETURNING *
        `,
        [image_url, alt_text]
    );

    return result.rows[0];
};

// ADMIN - UPDATE
export const updateMarqueeSponsor = async(id, data)=>{
    const {image_url, alt_text} = data;

    const result = await pool.query(
        `
        UPDATE marquee_sponsors
        SET
            image_url = COALESCE($1,image_url),
            alt_text = COALESCE($2,alt_text),
            updated_at = NOW()
        WHERE id=$3
        RETURNING *
        `,
        [image_url, alt_text, id]
    );
    return result.rows[0];
};

// ADMIN - TOGGLE
export const toggleMarqueeSponsor = async(id)=>{
    const result = await pool.query(
        `
        UPDATE marquee_sponsors
        SET 
            is_active = NOT is_active,
            updated_at = NOW()
        WHERE id=$1 
        RETURNING *
        `,
        [id]
    );

    return result.rows[0];
};

//ADMIN - DELETE 
export const deleteMarqueeSponsor= async(id)=>{
  const result = await pool.query(
        `
        DELETE FROM marquee_sponsors
        WHERE id=$1
        RETURNING *
        `,
        [id]
    );

    return result.rows[0];
};