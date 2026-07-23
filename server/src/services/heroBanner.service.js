import { pool } from "../config/db.js";

export const getHeroBanner = async()=>{
    const result = await pool.query(
        `
        SELECT * from hero_banner LIMIT 1
        `
    );
    return result.rows[0];
};

export const createHeroBanner = async(data)=>{
    const result = await pool.query(
        `
        INSERT INTO hero_banner
        (
            type, 
            media_url,
            poster_url,
            title, 
            subtitle
        )
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [
            data.type,
            data.media_url,
            data.poster_url,
            data.title,
            data.subtitle
        ]
    );
    return result.rows[0];
}

export const updateHeroBanner = async(data)=>{

        const result = await pool.query(
            `
            UPDATE hero_banner 
            SET 
            type=$1,
            media_url=$2,
            poster_url=$3,
            title=$4,
            subtitle=$5,
            updated_at=CURRENT_TIMESTAMP

            WHERE id=$6
            RETURNING *
            `,
            [
                data.type,
                data.media_url,
                data.poster_url,
                data.title,
                data.subtitle,
                data.id
            ]
        );

        return result.rows[0];
};