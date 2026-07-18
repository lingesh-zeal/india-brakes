import { pool } from "../config/db.js";

export const getDashboardData = async (req, res) => {
  try {
    // Total Events
    const events = await pool.query(
      `
      SELECT COUNT(*) 
      FROM events
      WHERE archived = false
      `,
    );

    // Total Registrations
    const registrations = await pool.query(
      `
      SELECT COUNT(*)
      FROM event_registrations
      `,
    );

    // Total Revenue
    const revenue = await pool.query(
      `
      SELECT COALESCE(SUM(fc.fee),0) AS total_revenue

      FROM event_registrations er

      JOIN event_fee_categories fc
      ON er.fee_category_id = fc.id
      `,
    );

    // Upcoming Events
    const upcomingEvents = await pool.query(
      `
      SELECT 
          id,
          title,
          event_date,
          event_end_date,
          venue,
          status_id,
          banner_url

      FROM events

      WHERE event_date >= CURRENT_TIMESTAMP
      AND archived = false

      ORDER BY event_date ASC

      LIMIT 5
      `,
    );

    // Recent Registrations
    const recentRegistrations = await pool.query(
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

          e.title AS event_name

      FROM event_registrations er

      JOIN events e
      ON er.event_id = e.id

      ORDER BY er.created_at DESC

      LIMIT 10
      `,
    );

    // Event Wise Registration Count
    const eventStats = await pool.query(
      `
      SELECT

          e.id,
          e.title,

          COUNT(er.id) AS registrations

      FROM events e

      LEFT JOIN event_registrations er

      ON e.id = er.event_id

      WHERE e.archived = false

      GROUP BY e.id, e.title

      ORDER BY registrations DESC
      `,
    );

    // Event Status Count
    const statusStats = await pool.query(
      `
       SELECT

      es.name AS status_name,
      COUNT(e.id) AS total

  FROM event_status es

  LEFT JOIN events e

  ON e.status_id = es.id

  GROUP BY es.name

  ORDER BY total DESC
      `,
    );

    res.status(200).json({
      success: true,

      stats: {
        totalEvents: Number(events.rows[0].count),

        totalRegistrations: Number(registrations.rows[0].count),

        totalRevenue: Number(revenue.rows[0].total_revenue),
      },

      upcomingEvents: upcomingEvents.rows,

      recentRegistrations: recentRegistrations.rows,

      eventStats: eventStats.rows,

      statusStats: statusStats.rows,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
