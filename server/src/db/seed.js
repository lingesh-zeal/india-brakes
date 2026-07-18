import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

const seedDatabase = async() =>{
    const client = await pool.connect();
    try{
        await client.query("BEGIN");

        // SEED EVENT STATUS

        const eventStatuses = [
            {
                name: "Draft",
                description: "Event is under preparation",
            },
            {
        name: "Upcoming",
        description: "Registration is open",
      },
      {
        name: "Ongoing",
        description: "Event is currently running",
      },
      {
        name: "Completed",
        description: "Event has concluded",
      },
      {
        name: "Cancelled",
        description: "Event has been cancelled",
      },
        ];

        for(const status of eventStatuses){
            await client.query(
                `
                INSERT INTO event_status (name, description)
                VALUES ($1,$2)
                ON CONFLICT (name) DO NOTHING
                `,
                [status.name, status.description]
            );
        }

        // seed Admin user 

        const username = process.env.ADMIN_USERNAME || "admin";
        const password = process.env.ADMIN_PASSWORD || "123456";

        const existingAdmin = await client.query(
            `SELECT id FROM admins WHERE username=$1`,
            [username]
        );

        if(existingAdmin.rowCount ===0){
            const passwordHash = await bcrypt.hash(password, 10);

            await client.query(
                `
                INSERT INTO admins
                (
                  username, password_hash
                )VALUES($1,$2)
                `,
                [username, passwordHash]
            );

            console.log("✅ Admin account created")
        }else {
      console.log("ℹ️ Admin account already exists");
    }
    await client.query("COMMIT");
    console.log("✅ Database seeded successfully");
    }catch(error){
        await client.query("ROLLBACK");
         console.error("❌ Seed failed");
        console.error(error);
    }finally{
        client.release();
        await pool.end();
    }
};

seedDatabase();