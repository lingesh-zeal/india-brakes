import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { generateToken } from "../utils/jwt.js";

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    const result = await pool.query(
      `SELECT * FROM admins WHERE username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = generateToken(admin);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        created_at: admin.created_at
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const me = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, username, created_at
      FROM admins
      WHERE id = $1
      `,
      [req.admin.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    return res.json({
      success: true,
      admin: result.rows[0]
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};