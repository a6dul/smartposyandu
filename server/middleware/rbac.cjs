// Definisi: tabel dan aksi apa saja yang boleh dilakukan per role
const ROLE_PERMISSIONS = {
  administrator: {
    tables: {
      profiles: ['select', 'insert', 'update', 'delete'],
      balita: ['select', 'insert', 'update', 'delete'],
      penimbangan: ['select', 'insert', 'update', 'delete'],
      ibu_hamil: ['select', 'insert', 'update', 'delete'],
      ibu_menyusui: ['select', 'insert', 'update', 'delete'],
      audit_logs: ['select', 'insert'],
      pengaturan_sistem: ['select', 'update'],
      jadwal_layanan: ['select', 'insert', 'update', 'delete'],
      notifikasi: ['select', 'insert', 'update', 'delete'],
    },
  },
  kader: {
    tables: {
      profiles: ['select'],
      balita: ['select', 'insert', 'update'],
      penimbangan: ['select', 'insert', 'update', 'delete'],
      ibu_hamil: ['select', 'insert', 'update'],
      ibu_menyusui: ['select', 'insert', 'update'],
      audit_logs: ['select', 'insert'],
      pengaturan_sistem: ['select'],
      jadwal_layanan: ['select', 'insert', 'update', 'delete'],
      notifikasi: ['select', 'insert', 'update', 'delete'],
    },
  },
  orang_tua: {
    tables: {
      profiles: ['select'],
      balita: ['select'],
      penimbangan: ['select'],
      ibu_hamil: [],
      ibu_menyusui: [],
      audit_logs: [],
      pengaturan_sistem: [],
      jadwal_layanan: ['select'],
      notifikasi: ['select'],
    },
  },
};

const checkPermission = (req, res, next) => {
  const { role } = req.user;
  const { table, action } = req.body;

  const perms = ROLE_PERMISSIONS[role];
  if (!perms) {
    return res.status(403).json({ error: `Role tidak dikenali: ${role}` });
  }

  const tablePerms = perms.tables[table];
  if (!tablePerms) {
    return res.status(403).json({ error: `Role '${role}' tidak memiliki akses ke tabel '${table}'.` });
  }

  if (!tablePerms.includes(action)) {
    return res.status(403).json({
      error: `Role '${role}' tidak diizinkan untuk aksi '${action}' pada tabel '${table}'.`
    });
  }

  next();
};

module.exports = {
  checkPermission,
  ROLE_PERMISSIONS
};
