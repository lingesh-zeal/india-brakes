import { pool } from "../config/db.js";

export const registerForEvent = async (req, res) => {
  try {
    const {
      event_id,
      fee_category_id,
      full_name,
      email,
      phone,
      organization,
      department,
      designation,
    } = req.body;

    //VALIDATION
    if (!event_id || !fee_category_id || !full_name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Required fileds missing",
      });
    }

    // CHECK EVENT EXIST
    const eventResult = await pool.query(
      `SELECT id, title, registration_deadline FROM events
            WHERE id=$1`,
      [event_id],
    );
    if (!eventResult.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const event = eventResult.rows[0];

    // Registration deadline Check
    if (
      event.registration_deadline &&
      new Date() > new Date(event.registration_deadline)
    ) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline expired",
      });
    }

    // Validate Fee Category belongs to event

    const feeResult = await pool.query(
      `SELECT id, category_name, fee
             FROM  event_fee_categories 
             WHERE id=$1 AND event_id=$2
            `,
      [fee_category_id, event_id],
    );

    if (!feeResult.rowCount) {
      return res.status(400).json({
        success: false,
        message: "Invalid Fee category",
      });
    }

    // INSERT REGISTRATION
    const registration = await pool.query(
      ` 
            INSERT INTO event_registrations
            (
                event_id, fee_category_id,
                full_name, email, phone,
                organization, department, designation
            ) VALUES 
             ($1,$2,$3,$4,$5,$6,$7,$8)
             RETURNING *
            `,
      [
        event_id,
        fee_category_id,
        full_name,
        email,
        phone,
        organization,
        department,
        designation,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Registration completed successfully",
      data: registration.rows[0],
    });
  } catch (error) {
    console.error("Registration Error:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        success: false,

        message: "You have already registered for this event",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        er.id,
        er.full_name,
        er.email,
        er.phone,
        er.organization,
        er.department,
        er.designation,
        er.created_at,
        fc.category_name,
        fc.fee,
        e.title AS event_name
      FROM event_registrations er
      JOIN events e
      ON er.event_id = e.id

      JOIN event_fee_categories fc
      ON er.fee_category_id = fc.id

      WHERE er.event_id = $1
      ORDER BY er.created_at DESC
      `,
      [id],
    );

    res.status(200).json({
      success: true,

      event_id: id,

      count: result.rows.length,

      data: result.rows,
    });
  } catch (error) {
    console.error("Get Registrations Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
