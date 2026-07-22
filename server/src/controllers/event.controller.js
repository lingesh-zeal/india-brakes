import { pool } from "../config/db.js";
import slugify from "slugify";
import { deleteFile } from "../utils/fileCleanup.js";
import path from "path";
import { lifecycleCase } from "../utils/eventLifecycleSql.js";

/* =========================
   GET EVENTS
========================= */

export const getEvents = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const status = req.query.status;
    const homepage = req.query.homepage;
    const lifecycle = req.query.lifecycle;

    let where = `WHERE 1=1`;

    const values = [];
    let index = 1;

    if (search) {
      where += `
        AND (
          LOWER(e.title) LIKE LOWER($${index})
          OR LOWER(e.description) LIKE LOWER($${index})
          OR LOWER(e.venue) LIKE LOWER($${index})
          OR LOWER(e.organized_by) LIKE LOWER($${index})
        )
      `;

      values.push(`%${search}%`);
      index++;
    }

    if (status) {
      where += ` AND e.status_id = $${index}`;
      values.push(status);
      index++;
    }

    if (homepage === "true") {
      where += ` AND e.is_homepage = true`;
    }

    if (lifecycle) {
      where += ` AND (${lifecycleCase}) = $${index}`;
      values.push(lifecycle);
      index++;
    }

    // MAIN QUERY

    const queryValues = [...values, limit, offset];

    const dataQuery = `
      SELECT 
      e.*,
      s.name AS status,

      (${lifecycleCase}) AS lifecycle,

      COUNT(DISTINCT er.id)::INT AS registration_count,
      COUNT(DISTINCT sp.id)::INT AS speaker_count,
      COUNT(DISTINCT spo.id)::INT AS sponsor_count

      FROM events e

      LEFT JOIN event_status s ON e.status_id = s.id
      LEFT JOIN event_registrations er ON er.event_id = e.id
      LEFT JOIN event_speakers sp ON sp.event_id = e.id
      LEFT JOIN event_sponsors spo ON spo.event_id = e.id
      
      ${where}

      GROUP BY e.id, s.name

      ORDER BY e.event_date DESC
      LIMIT $${index}
      OFFSET $${index + 1}
    `;

    const countQuery = `
    SELECT COUNT(DISTINCT e.id)::INT AS total
    FROM events e
    LEFT JOIN event_status s ON e.status_id = s.id
    ${where}
    `;

    const [eventResult, countResult] = await Promise.all([
      pool.query(dataQuery, queryValues),
      pool.query(countQuery, values),
    ]);

    const total = countResult.rows[0].total;

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: eventResult.rows.length,
      data: eventResult.rows,
    });
  } catch (error) {
    console.error("Get Events Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* =========================
   GET EVENT BY ID
========================= */

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT 
          e.*, 
          s.name AS status,

          (${lifecycleCase}) AS lifecycle

      FROM events e
      LEFT JOIN event_status s ON e.status_id = s.id
      WHERE e.id = $1 AND e.archived=false
      `,
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const event = result.rows[0];

    const speakers = await pool.query(
      `SELECT * FROM event_speakers WHERE event_id=$1 ORDER BY display_order`,
      [id],
    );

    const sponsors = await pool.query(
      `SELECT * FROM event_sponsors WHERE event_id=$1 ORDER BY display_order`,
      [id],
    );

    const fees = await pool.query(
      `SELECT * FROM event_fee_categories WHERE event_id=$1 ORDER BY display_order`,
      [id],
    );

    const photos = await pool.query(
      `SELECT * FROM event_photos WHERE event_id=$1`,
      [id],
    );

    event.speakers = speakers.rows;
    event.sponsors = sponsors.rows;
    event.fee_categories = fees.rows;
    event.photos = photos.rows;

    res.json({ success: true, data: event });
  } catch (error) {
    console.error("Get Event By ID Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   CREATE EVENT
========================= */
export const createEvent = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      title,
      description,
      status_id,
      venue,
      organized_by,
      event_date,
      event_end_date,
      registration_deadline,
      registration_url,
      workshop_themes,
      target_audience,
      is_homepage,
      speakers,
      fee_categories,
      sponsors,
    } = req.body;

    const parsedSpeakers =
      typeof speakers === "string" ? JSON.parse(speakers) : speakers || [];
    const parsedFees =
      typeof fee_categories === "string"
        ? JSON.parse(fee_categories)
        : fee_categories || [];
    const parsedSponsors =
      typeof sponsors === "string" ? JSON.parse(sponsors) : sponsors || [];
    const parsedThemes =
      typeof workshop_themes === "string"
        ? JSON.parse(workshop_themes)
        : workshop_themes || [];
    const parsedAudience =
      typeof target_audience === "string"
        ? JSON.parse(target_audience)
        : target_audience || [];

    const banner_url = req.files?.banner?.[0]
      ? path
          .join("uploads", "banners", req.files.banner[0].filename)
          .replace(/\\/g, "/")
      : null;

    const brochure_url = req.files?.brochure?.[0]
      ? path
          .join("uploads", "brochures", req.files.brochure[0].filename)
          .replace(/\\/g, "/")
      : null;

    const speakerImages = req.files?.speaker_images || [];
    const sponsorLogos = req.files?.sponsor_logos || [];
    const photos = req.files?.photos || [];

    /* slug */
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const check = await client.query("SELECT 1 FROM events WHERE slug=$1", [
        slug,
      ]);
      if (!check.rowCount) break;
      slug = `${baseSlug}-${counter++}`;
    }

    /* insert event */
    const eventResult = await client.query(
      `
      INSERT INTO events (
        title, slug, description, status_id, venue,
        organized_by, event_date, event_end_date,
        registration_deadline,registration_url, banner_url, brochure_url,
        workshop_themes, target_audience, is_homepage
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *;
      `,
      [
        title,
        slug,
        description,
        status_id,
        venue,
        organized_by,
        event_date || null,
        event_end_date || null,
        registration_deadline || null,
        registration_url,
        banner_url,
        brochure_url,
        parsedThemes,
        parsedAudience,
        is_homepage === "true" || is_homepage === true,
      ],
    );

    const eventId = eventResult.rows[0].id;

    /* speakers */
    for (let i = 0; i < parsedSpeakers.length; i++) {
      const sp = parsedSpeakers[i];
      const img = speakerImages[i];

      const imagePath = img
        ? path.join("uploads", "speakers", img.filename).replace(/\\/g, "/")
        : null;

      await client.query(
        `
        INSERT INTO event_speakers (
          event_id, name, role, designation, department,
          organization, profile_image_url, display_order
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        `,
        [
          eventId,
          sp.name,
          sp.role,
          sp.designation,
          sp.department,
          sp.organization,
          imagePath,
          sp.display_order || 1,
        ],
      );
    }

    /* fees */
    for (const fee of parsedFees) {
      await client.query(
        `
        INSERT INTO event_fee_categories (
          event_id, category_name, fee, currency, display_order
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          eventId,
          fee.category_name,
          fee.fee,
          fee.currency || "INR",
          fee.display_order || 1,
        ],
      );
    }

    /* sponsors */
    for (let i = 0; i < parsedSponsors.length; i++) {
      const s = parsedSponsors[i];
      const logoFile = sponsorLogos[i];

      const logoPath = logoFile
        ? path
            .join("uploads", "sponsors", logoFile.filename)
            .replace(/\\/g, "/")
        : null;

      await client.query(
        `
        INSERT INTO event_sponsors (
          event_id, sponsor_name, logo_url, website_url, display_order
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          eventId,
          s.sponsor_name,
          logoPath,
          s.website_url,
          s.display_order || 1,
        ],
      );
    }

    /* photos */
    for (const file of photos) {
      const photoPath = path
        .join("uploads", "events", file.filename)
        .replace(/\\/g, "/");

      await client.query(
        `
        INSERT INTO event_photos (event_id, image_url, caption)
        VALUES ($1,$2,$3)
        `,
        [eventId, photoPath, null],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: eventResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

/* =========================
   UPDATE EVENT
========================= */
export const updateEvent = async (req, res) => {
  const client = await pool.connect();

  // Store files that should be deleted AFTER COMMIT
  const filesToDelete = [];

  try {
    await client.query("BEGIN");

    const { id } = req.params;

    const {
      title,
      description,
      status_id,
      venue,
      organized_by,
      event_date,
      event_end_date,
      registration_deadline,
      registration_url,
      workshop_themes,
      target_audience,
      is_homepage,
      speakers,
      fee_categories,
      sponsors,
    } = req.body;

    const parsedSpeakers =
      typeof speakers === "string" ? JSON.parse(speakers) : speakers || [];
    const parsedFees =
      typeof fee_categories === "string"
        ? JSON.parse(fee_categories)
        : fee_categories || [];
    const parsedSponsors =
      typeof sponsors === "string" ? JSON.parse(sponsors) : sponsors || [];
    const parsedThemes =
      typeof workshop_themes === "string"
        ? JSON.parse(workshop_themes)
        : workshop_themes || [];
    const parsedAudience =
      typeof target_audience === "string"
        ? JSON.parse(target_audience)
        : target_audience || [];

    const existingEvent = await client.query(
      `SELECT banner_url, brochure_url FROM events WHERE id=$1`,
      [id],
    );

    if (!existingEvent.rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const oldBanner = existingEvent.rows[0].banner_url;
    const oldBrochure = existingEvent.rows[0].brochure_url;

    // NEW EVENT FILES

    const banner_url = req.files?.banner?.[0]
      ? path
          .join("uploads", "banners", req.files.banner[0].filename)
          .replace(/\\/g, "/")
      : null;

    const brochure_url = req.files?.brochure?.[0]
      ? path
          .join("uploads", "brochures", req.files.brochure[0].filename)
          .replace(/\\/g, "/")
      : null;

    if (banner_url && oldBanner) filesToDelete.push(oldBanner);
    if (brochure_url && oldBrochure) filesToDelete.push(oldBrochure);

    const updated = await client.query(
      `
      UPDATE events SET
        title=$1,
        description=$2,
        status_id=$3,
        venue=$4,
        organized_by=$5,

        event_date=$6,
        event_end_date=$7,
        registration_deadline=$8,
        registration_url=$9,

        workshop_themes=$10,
        target_audience=$11,

        is_homepage=$12,

        banner_url=COALESCE($13,banner_url),
        brochure_url=COALESCE($14,brochure_url),
        updated_at=NOW()
      WHERE id=$15
      RETURNING *;
      `,
      [
        title,
        description,
        status_id,
        venue,
        organized_by,
        event_date || null,
        event_end_date || null,
        registration_deadline || null,
        registration_url,
        parsedThemes,
        parsedAudience,
        is_homepage === "true" || is_homepage === true,
        banner_url,
        brochure_url,
        id,
      ],
    );

    if (!updated.rowCount) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // SPEAKERS

    const speakerImages = req.files?.speaker_images || [];

    let speakerImageIndex = 0;

    for (const sp of parsedSpeakers) {
      let imagePath = sp.profile_image_url || null;

      if (sp.has_new_image && speakerImages[speakerImageIndex]) {
        const uploaded = speakerImages[speakerImageIndex];

        if (sp.id) {
          const oldSpeaker = await client.query(
            `SELECT profile_image_url FROM event_speakers WHERE id=$1`,
            [sp.id],
          );

          if (oldSpeaker.rowCount) {
            const oldImage = oldSpeaker.rows[0].profile_image_url;

            if (oldImage) {
              filesToDelete.push(oldImage);
            }
          }
        }

        imagePath = path
          .join("uploads", "speakers", uploaded.filename)
          .replace(/\\/g, "/");

        speakerImageIndex++;
      }

      if (sp.id) {
        await client.query(
          `
          UPDATE event_speakers SET
            name=$1,
            role=$2,
            designation=$3,
            department=$4,
            organization=$5,
            profile_image_url=$6,
            display_order=$7
          WHERE id=$8
          `,
          [
            sp.name,
            sp.role,
            sp.designation,
            sp.department,
            sp.organization,
            imagePath,
            sp.display_order || 1,
            sp.id,
          ],
        );
      } else {
        await client.query(
          `INSERT INTO event_speakers
          (
            event_id,
            name, role, designation, department, organization,
            profile_image_url,display_order
          ) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
          [
            id,
            sp.name,
            sp.role,
            sp.designation,
            sp.department,
            sp.organization,
            imagePath,
            sp.display_order || 1,
          ],
        );
      }
    }

    // FEES
    await client.query("DELETE FROM event_fee_categories WHERE event_id=$1", [
      id,
    ]);

    for (const fee of parsedFees) {
      await client.query(
        `
        INSERT INTO event_fee_categories (
          event_id,category_name,fee,currency,display_order
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          id,
          fee.category_name,
          fee.fee,
          fee.currency || "INR",
          fee.display_order || 1,
        ],
      );
    }

    // SPONSORS
    const sponsorLogos = req.files?.sponsor_logos || [];
    let i = 0;

    for (const sponsor of parsedSponsors) {
      let logoPath = sponsor.logo_url || null;

      if (sponsor.has_new_logo && sponsorLogos[i]) {
        const updatedLogo = sponsorLogos[i];
        if (sponsor.id) {
          const oldSponsor = await client.query(
            `
              SELECT logo_url
              FROM event_sponsors
              WHERE id=$1
              `,
            [sponsor.id],
          );

          if (oldSponsor.rowCount) {
            const oldLogo = oldSponsor.rows[0].logo_url;

            if (oldLogo) {
              filesToDelete.push(oldLogo);
            }
          }
        }
        logoPath = path
          .join("uploads", "sponsors", updatedLogo.filename)
          .replace(/\\/g, "/");

        i++;
      }

      if (sponsor.id) {
        await client.query(
          `UPDATE event_sponsors SET 
          sponsor_name=$1,
          logo_url=$2, website_url=$3, display_order=$4
          WHERE id=$5
          `,
          [
            sponsor.sponsor_name,
            logoPath,
            sponsor.website_url,
            sponsor.display_order || 1,
            sponsor.id,
          ],
        );
      } else {
        await client.query(
          `
          INSERT INTO event_sponsors (
          event_id,sponsor_name,logo_url,website_url,display_order
          )
          VALUES ($1,$2,$3,$4,$5)
          `,
          [
            id,
            sponsor.sponsor_name,
            logoPath,
            sponsor.website_url,
            sponsor.display_order || 1,
          ],
        );
      }
    }

    //Event photos update
    const photosRemoved = req.body.photos_removed
      ? JSON.parse(req.body.photos_removed)
      : [];

    //  DELETE SELECTED OLD PHOTOS
    for (const photoId of photosRemoved) {
      const oldPhoto = await client.query(
        "SELECT image_url FROM event_photos WHERE id=$1 and event_id=$2",
        [photoId, id],
      );

      if (oldPhoto.rowCount) {
        await client.query(`DELETE FROM event_photos WHERE id=$1`, [photoId]);

        if (oldPhoto.rows[0].image_url) {
          filesToDelete.push(oldPhoto.rows[0].image_url);
        }
      }
    }

    // ADD NEW PHOTOS
    const uploadedPhotos = req.files?.photos || [];

    for (const file of uploadedPhotos) {
      const photoPath = path
        .join("uploads", "events", file.filename)
        .replace(/\\/g, "/");

      await client.query(
        `
          INSERT INTO event_photos (event_id,image_url,caption)
          VALUES($1,$2,$3)
          `,
        [id, photoPath, null],
      );
    }

    await client.query("COMMIT");

    for (const file of filesToDelete) {
      if (file) deleteFile(file);
    }

    res.json({
      success: true,
      message: "Event updated successfully",
      data: updated.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update Event Error", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

/* =========================
   DELETE EVENT
========================= */
export const deleteEvent = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const { id } = req.params;

    const files = await client.query(
      `SELECT banner_url, brochure_url FROM events WHERE id=$1`,
      [id],
    );

    const speakers = await client.query(
      `SELECT profile_image_url FROM event_speakers WHERE event_id=$1`,
      [id],
    );

    const sponsors = await client.query(
      `SELECT logo_url FROM event_sponsors WHERE event_id=$1`,
      [id],
    );

    const photos = await client.query(
      `SELECT image_url FROM event_photos WHERE event_id=$1`,
      [id],
    );

    await client.query("DELETE FROM event_speakers WHERE event_id=$1", [id]);
    await client.query("DELETE FROM event_fee_categories WHERE event_id=$1", [
      id,
    ]);
    await client.query("DELETE FROM event_sponsors WHERE event_id=$1", [id]);
    await client.query("DELETE FROM event_photos WHERE event_id=$1", [id]);
    await client.query("DELETE FROM events WHERE id=$1", [id]);

    await client.query("COMMIT");

    const event = files.rows?.[0];

    if (event) {
      deleteFile(event.banner_url);
      deleteFile(event.brochure_url);
    }

    speakers.rows?.forEach((s) => deleteFile(s.profile_image_url));
    sponsors.rows?.forEach((s) => deleteFile(s.logo_url));
    photos.rows?.forEach((p) => deleteFile(p.image_url));

    res.json({
      success: true,
      message: "Event deleted successfully with files cleaned",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

// export const updateEventStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status_id, archived } = req.body;

//     let query = "UPDATE events SET ";
//     const values = [];
//     let idx = 1;

//     if (status_id !== undefined) {
//       query += `status_id = $${idx} `;
//       values.push(status_id);
//       idx++;
//     }

//     if (archived !== undefined) {
//       if (idx > 1) query += ", ";
//       query += `archived = $${idx} `;
//       values.push(archived);
//       idx++;
//     }

//     if (idx === 1) {
//       return res.status(400).json({ success: false, message: "No valid fields provided" });
//     }

//     query += `WHERE id = $${idx} RETURNING *`;
//     values.push(id);

//     const result = await pool.query(query, values);

//     if (!result.rowCount) {
//       return res.status(404).json({ success: false, message: "Event not found" });
//     }

//     res.json({ success: true, data: result.rows[0], message: "Event updated successfully" });
//   } catch (error) {
//     console.error("Update Event Status Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusResult = await pool.query(
      `SELECT id FROM event_status WHERE name=$1`,
      [status],
    );

    if(!statusResult.rows.length){
      return res.status(400).json({
        success: false, 
        messahe: "Invalid status"
      })
    };

    const result = await pool.query(
      `UPDATE events SET status_id=$1,
            updated_at=NOW()
            WHERE id=$2
            RETURNING *
        `,
      [statusResult.rows[0].id, id],
    );

    res.json({
      success: true,
      message: "Status updated",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update Event Status Error: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const archiveEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE events
        SET archived=true,
        updated_at=NOW()
        WHERE id=$1
      RETURNING *
      `,
      [id],
    );

    res.json({
      success: true,
      message: "Event Archived",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Archive Event Error: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const restoreEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE events
        SET archived=false,
        updated_at=NOW()
        WHERE id=$1
      RETURNING *
      `,
      [id],
    );

    res.json({
      success: true,
      message: "Event restored",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllSponsors = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (es.sponsor_name)
        es.id,
        es.sponsor_name,
        es.logo_url,
        es.website_url
      FROM event_sponsors es
      INNER JOIN events e
        ON es.event_id = e.id
      INNER JOIN event_status st
        ON e.status_id = st.id
      WHERE
        e.archived = FALSE
        AND st.name = 'Published'
      ORDER BY es.sponsor_name, es.id DESC;
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get All Sponsors Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// export const getAllSponsors = async(req, res)=>{
//   try{
//     const result = await pool.query(
//       `
//       SELECT DISTINCT ON (sponsor_name)
//         id, sponsor_name, logo_url, website_url
//       FROM event_sponsors
//       ORDER BY sponsor_name, id DESC
//       `);

//       res.json({
//         success: true,
//         data: result.rows
//       })
//   }catch(error){
//     console.error("Get All Sponsors Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
