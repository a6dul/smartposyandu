const express = require('express');
const router = express.Router();
const { queryAsync } = require('../config/db.cjs');
const { verifyToken } = require('../middleware/auth.cjs');
const { checkPermission } = require('../middleware/rbac.cjs');
const { ALLOWED_FIELDS, sanitizePayload, validateRequired } = require('../middleware/validation.cjs');

router.post('/', verifyToken, checkPermission, async (req, res) => {
  const { table, action, filters, payload, sortConfig, isSingle } = req.body;

  const allowedTables = Object.keys(ALLOWED_FIELDS);
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Tabel tidak valid.' });
  }

  if (filters && filters.length > 0) {
    const allowed = ALLOWED_FIELDS[table] || [];
    const badFilter = filters.find(f => !allowed.includes(f.field));
    if (badFilter) {
      return res.status(400).json({ error: `Field filter '${badFilter.field}' tidak diizinkan.` });
    }
  }

  try {
    if (action === 'select') {
      let sql = `SELECT * FROM \`${table}\``;
      const params = [];

      if (filters && filters.length > 0) {
        const whereClauses = filters.map(f => {
          params.push(f.value);
          return `\`${f.field}\` = ?`;
        });
        sql += ` WHERE ` + whereClauses.join(' AND ');
      }

      if (sortConfig && sortConfig.field) {
        const allowed = ALLOWED_FIELDS[table] || [];
        if (allowed.includes(sortConfig.field)) {
          const order = sortConfig.ascending ? 'ASC' : 'DESC';
          sql += ` ORDER BY \`${sortConfig.field}\` ${order}`;
        }
      }

      const rows = await queryAsync(sql, params);

      const formattedRows = rows.map(row => {
        if ('status_aktif' in row) {
          row.status_aktif = row.status_aktif === 1 || row.status_aktif === true;
        }
        if ('password' in row) {
          delete row.password;
        }
        return row;
      });

      if (isSingle) {
        return res.json({ data: formattedRows[0] || null, error: null });
      }
      return res.json({ data: formattedRows, error: null });
    }

    if (action === 'insert') {
      const results = [];
      for (const item of payload) {
        const sanitized = sanitizePayload(table, item);

        const missingFields = validateRequired(table, sanitized);
        if (missingFields.length > 0) {
          return res.status(400).json({ error: `Field wajib tidak diisi: ${missingFields.join(', ')}` });
        }

        if ('status_aktif' in sanitized) {
          sanitized.status_aktif = sanitized.status_aktif ? 1 : 0;
        }

        if (!sanitized.id) {
          sanitized.id = `loc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        }
        if (!sanitized.created_at) {
          sanitized.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }

        const fields = Object.keys(sanitized).map(k => `\`${k}\``).join(', ');
        const placeholders = Object.keys(sanitized).map(() => '?').join(', ');
        const values = Object.values(sanitized);

        const sql = `INSERT INTO \`${table}\` (${fields}) VALUES (${placeholders})`;
        await queryAsync(sql, values);
        results.push(sanitized);
      }
      return res.json({ data: results, error: null });
    }

    if (action === 'update') {
      const sanitized = sanitizePayload(table, payload);

      if (Object.keys(sanitized).length === 0) {
        return res.status(400).json({ error: 'Tidak ada field valid yang bisa diupdate.' });
      }

      if ('status_aktif' in sanitized) {
        sanitized.status_aktif = sanitized.status_aktif ? 1 : 0;
      }

      const setClause = Object.keys(sanitized).map(k => `\`${k}\` = ?`).join(', ');
      const values = Object.values(sanitized);

      let sql = `UPDATE \`${table}\` SET ${setClause}`;
      const params = [...values];

      if (filters && filters.length > 0) {
        const allowed = ALLOWED_FIELDS[table] || [];
        const badFilter = filters.find(f => !allowed.includes(f.field));
        if (badFilter) {
          return res.status(400).json({ error: `Field filter '${badFilter.field}' tidak diizinkan.` });
        }
        const whereClauses = filters.map(f => {
          params.push(f.value);
          return `\`${f.field}\` = ?`;
        });
        sql += ` WHERE ` + whereClauses.join(' AND ');
      } else {
        return res.status(400).json({ error: 'Update membutuhkan filter (eq).' });
      }

      await queryAsync(sql, params);
      return res.json({ data: sanitized, error: null });
    }

    if (action === 'delete') {
      if (!filters || filters.length === 0) {
        return res.status(400).json({ error: 'Delete membutuhkan filter (eq).' });
      }

      const allowed = ALLOWED_FIELDS[table] || [];
      const badFilter = filters.find(f => !allowed.includes(f.field));
      if (badFilter) {
        return res.status(400).json({ error: `Field filter '${badFilter.field}' tidak diizinkan.` });
      }

      const params = [];
      const whereClauses = filters.map(f => {
        params.push(f.value);
        return `\`${f.field}\` = ?`;
      });
      const sql = `DELETE FROM \`${table}\` WHERE ` + whereClauses.join(' AND ');

      await queryAsync(sql, params);
      return res.json({ data: true, error: null });
    }

    return res.status(400).json({ error: 'Aksi query tidak dikenal.' });
  } catch (err) {
    console.error('Error Query:', err.message);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

module.exports = router;
