import pool from '../db.js';
import { validationResult } from 'express-validator';

// Add school
export const addSchool = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, address, latitude, longitude } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO schools (name, address, location)
       VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography)
       RETURNING id`,
      [name, address, longitude, latitude]
    );

    res.status(201).json({ message: 'School added', schoolId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

// List schools sorted by proximity
export const listSchools = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const lat = parseFloat(req.query.latitude);
  const lon = parseFloat(req.query.longitude);

  try {
    const result = await pool.query(
      `SELECT id, name, address,
              ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) AS distance_m
       FROM schools
       ORDER BY distance_m ASC`,
      [lon, lat]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
