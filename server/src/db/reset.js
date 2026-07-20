import { pool } from "../config/db.js";

try {

    await pool.query(`
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
    `);

    console.log("Render database cleared");

} catch(error) {

    console.error(error);

} finally {

    await pool.end();

}