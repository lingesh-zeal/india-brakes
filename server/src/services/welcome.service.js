import { pool } from "../config/db.js";

export const getWelcome = async () => {
  const section = await pool.query(`SELECT * FROM welcome_sections LIMIT 1`);

  const images = await pool.query(
    `SELECT * 
        FROM welcome_carousel_images ORDER BY display_order`,
  );

  const carousel = images.rows.map((img) => ({
    ...img,
    image: `uploads/${img.image}`,
  }));

  return {
    section: section.rows[0],
    carousel,
  };
};

export const updateSection = async (data) => {
  const { heading, sub_heading, content } = data;

  const result = await pool.query(
    `UPDATE welcome_sections 
        SET 
        heading=$1, 
        sub_heading=$2,
        content=$3,
        updated_at=NOW()
        WHERE id=1
        RETURNING *
        `,
    [heading, sub_heading, content],
  );

  return result.rows[0];
};

export const countImages = async () => {
  const result = await pool.query(
    `SELECT COUNT(*)::INT total
        FROM welcome_carousel_images`,
  );
  return result.rows[0].total;
};

export const addImage = async (data) => {
  const orderResult = await pool.query(
    `SELECT COALESCE(MAX(display_order),0)+1 AS next_order
        FROM welcome_carousel_images`,
  );

  const displayOrder = orderResult.rows[0].next_order;
  const result = await pool.query(
    `INSERT INTO welcome_carousel_images
        (
            image, alt_tag, display_order
        )
        VALUES($1,$2,$3)
        RETURNING *
        `,
    [`carousel/${data.image}`, data.alt_tag, displayOrder],
  );
  return {
    ...result.rows[0],
    image: `uploads/${result.rows[0].image}`
    };
};

export const getImage = async (id) => {
  const result = await pool.query(
    `SELECT * FROM welcome_carousel_images WHERE id=$1`,
    [id],
  );
  return result.rows[0];
};

export const updateImage = async (id, data) => {
  const result = await pool.query(
    `
        UPDATE welcome_carousel_images
        SET 
            image=$1,
            alt_tag=$2
        WHERE id=$3
        RETURNING *
        `,
    [data.image, data.alt_tag, id],
  );

  return {
    ...result.rows[0],
     image: `uploads/${result.rows[0].image}`
  }
};

export const deleteImage = async (id) => {
  await pool.query(`DELETE FROM welcome_carousel_images WHERE id=$1`, [id]);
};
