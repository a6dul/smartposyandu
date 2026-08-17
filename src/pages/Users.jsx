import React, { useState, useEffect } from 'react';
import Modal from '../components/UI/Modal';
import Dropdown from '../components/UI/Dropdown';
import Toast from '../components/UI/Toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// ── Komponen Form Pengguna ────────────────────────────────────
const FormPengguna = ({ data, onClose, onSave }) => {
  const [form, setForm] = useState({
    nama_lengkap: data?.nama_lengkap || '',
    email: data?.email || '',
    password: '',
    role: data?.role || 'orang_tua',
    telepon: data?.telepon || '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSave(form); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-2">
      <div className="space-y-1">
        <label className="text-sm font-bold text-on-surface">Nama Lengkap *</label>
        <input name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} required
          className="w-full h-14 px-4 rounded-xl border-2 border-outline-variant focus:border-primary outline-none text-body-md bg-surface transition-all" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-bold text-on-surface">Email *</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required disabled={!!data}
          className="w-full h-14 px-4 rounded-xl border-2 border-outline-variant focus:border-primary outline-none text-body-md bg-surface transition-all disabled:opacity-50" />
      </div>
      {!data && (
        <div className="space-y-1">
          <label className="text-sm font-bold text-on-surface">Password Sementara *</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required
            className="w-full h-14 px-4 rounded-xl border-2 border-outline-variant focus:border-primary outline-none text-body-md bg-surface transition-all" />
        </div>
      )}
      <div className="space-y-1">
        <label className="text-sm font-bold text-on-surface">Nomor HP</label>
        <input name="telepon" type="tel" value={form.telepon} onChange={handleChange} placeholder="0812..."
          className="w-full h-14 px-4 rounded-xl border-2 border-outline-variant focus:border-primary outline-none text-body-md bg-surface transition-all" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-bold text-on-surface">Role / Peran</label>
        <select name="role" value={form.role} onChange={handleChange}
          className="w-full h-14 px-4 rounded-xl border-2 border-outline-variant focus:border-primary outline-none text-body-md bg-surface transition-all">
          <option value="orang_tua">Orang Tua</option>
          <option value="kader">Kader / Bidan</option>
          <option value="administrator">Administrator</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onClose}
          className="flex-1 h-14 rounded-xl border-2 border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors">Batal</button>
        <button type="submit"
          className="flex-1 h-14 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-all shadow-md">
          {data ? 'Simpan Perubahan' : 'Tambah Pengguna'}
        </button>
      </div>
    </form>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const Users = () => {
  const { logAudit } = useAuth();
  const [activeTab, setActiveTab] = useState('pengguna');
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingAudit, setLoadingAudit] = useState(true);
  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const closeModal = () => { setModal(null); setSelectedUser(null); };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoadingUsers(false);
  };

  const fetchAudit = async () => {
    setLoadingAudit(true);
    const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
    setAuditLogs(data || []);
    setLoadingAudit(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchAudit();
  }, []);

  const handleSave = async (form) => {
    if (modal === 'tambah') {
      const newUser = {
        id: `usr-${Date.now()}`,
        email: form.email,
        nama_lengkap: form.nama_lengkap,
        role: form.role,
        telepon: form.telepon,
      };
      const { error } = await supabase.from('profiles').insert([newUser]);
      if (error) { showToast('Gagal menambahkan pengguna: ' + error.message, 'error'); return; }
      showToast(`Pengguna ${form.nama_lengkap} berhasil ditambahkan!`);
      logAudit('CREATE', 'Manajemen Pengguna', `Menambahkan pengguna baru: ${form.nama_lengkap}`);
    } else {
      const { error } = await supabase.from('profiles').update({
        nama_lengkap: form.nama_lengkap,
        role: form.role,
        telepon: form.telepon,
      }).eq('id', selectedUser.id);
      if (error) { showToast('Gagal memperbarui: ' + error.message, 'error'); return; }
      showToast(`Data pengguna ${form.nama_lengkap} berhasil diperbarui!`);
      logAudit('UPDATE', 'Manajemen Pengguna', `Memperbarui pengguna: ${form.nama_lengkap}`);
    }
    fetchUsers();
    closeModal();
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('profiles').delete().eq('id', selectedUser.id);
    if (error) { showToast('Gagal hapus: ' + error.message, 'error'); return; }
    showToast(`Pengguna ${selectedUser.nama_lengkap} berhasil dihapus.`, 'warning');
    logAudit('DELETE', 'Manajemen Pengguna', `Menghapus pengguna: ${selectedUser.nama_lengkap}`);
    fetchUsers();
    closeModal();
  };

  const roleConfig = {
    administrator: { label: 'Administrator', cls: 'bg-error-container/30 text-error' },
    kader: { label: 'Kader / Bidan', cls: 'bg-primary-container/20 text-primary' },
    orang_tua: { label: 'Orang Tua', cls: 'bg-surface-variant text-on-surface-variant' },
  };

  const filteredUsers = users.filter(u =>
    u.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-margin-page flex flex-col gap-6 max-w-7xl mx-auto w-full pb-32">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-headline-lg font-bold text-on-surface">Manajemen Sistem</h3>
          <p className="text-body-lg text-on-surface-variant">Kelola akses pengguna dan pantau aktivitas sistem Posyandu.</p>
        </div>
      </div>

      <div className="flex border-b-2 border-outline-variant/30">
        {['pengguna', 'audit'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-bold text-base transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
            {tab === 'pengguna' ? 'Daftar Pengguna' : 'Audit Trail (Log)'}
            {activeTab === tab && <div className="absolute bottom-[-2px] left-0 w-full h-1 bg-primary rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* TAB: PENGGUNA */}
      {activeTab === 'pengguna' && (
        <div className="space-y-4">
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-outline-variant focus:border-primary outline-none text-body-md transition-all bg-surface"
                placeholder="Cari nama atau email..." />
            </div>
            <button onClick={() => setModal('tambah')}
              className="w-full md:w-auto h-12 px-6 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">person_add</span>
              Tambah Pengguna
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="p-4 font-bold text-on-surface-variant">Pengguna</th>
                    <th className="p-4 font-bold text-on-surface-variant">Role</th>
                    <th className="p-4 font-bold text-on-surface-variant">Telepon</th>
                    <th className="p-4 font-bold text-on-surface-variant text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {loadingUsers ? (
                    <tr><td colSpan={4} className="p-8 text-center text-on-surface-variant">Memuat data...</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-on-surface-variant">Belum ada pengguna terdaftar.</td></tr>
                  ) : filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-surface-container/40">
                      <td className="p-4">
                        <p className="font-bold text-on-surface">{u.nama_lengkap}</p>
                        <p className="text-sm text-on-surface-variant">{u.email}</p>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${roleConfig[u.role]?.cls || ''}`}>
                          {roleConfig[u.role]?.label || u.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-on-surface-variant">{u.telepon || '-'}</td>
                      <td className="p-4 text-right">
                        <Dropdown
                          trigger={<button className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant"><span className="material-symbols-outlined">more_vert</span></button>}
                          items={[
                            { label: 'Edit Data', icon: 'edit', onClick: () => { setSelectedUser(u); setModal('edit'); } },
                            { label: 'Hapus Pengguna', icon: 'delete', onClick: () => { setSelectedUser(u); setModal('hapus'); } },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant flex items-center justify-between">
            <p className="text-sm font-bold text-on-surface-variant">Menampilkan aktivitas terbaru sistem.</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="p-4 font-bold text-on-surface-variant w-48">Waktu</th>
                    <th className="p-4 font-bold text-on-surface-variant w-56">Pengguna</th>
                    <th className="p-4 font-bold text-on-surface-variant w-32">Aksi</th>
                    <th className="p-4 font-bold text-on-surface-variant w-32">Modul</th>
                    <th className="p-4 font-bold text-on-surface-variant">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {loadingAudit ? (
                    <tr><td colSpan={5} className="p-8 text-center text-on-surface-variant">Memuat log...</td></tr>
                  ) : auditLogs.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-on-surface-variant">Belum ada aktivitas tercatat.</td></tr>
                  ) : auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-surface-container/40">
                      <td className="p-4 text-sm text-on-surface-variant font-medium">
                        {new Date(log.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 text-sm font-bold text-on-surface">{log.nama_user || '-'}</td>
                      <td className="p-4 text-sm text-primary font-bold">{log.aksi}</td>
                      <td className="p-4 text-sm text-on-surface-variant">{log.modul}</td>
                      <td className="p-4 text-sm text-on-surface-variant">{log.deskripsi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <Modal isOpen={modal === 'tambah'} onClose={closeModal} title="Tambah Pengguna Baru" size="md">
        <FormPengguna onClose={closeModal} onSave={handleSave} />
      </Modal>
      <Modal isOpen={modal === 'edit'} onClose={closeModal} title="Edit Pengguna" size="md">
        <FormPengguna data={selectedUser} onClose={closeModal} onSave={handleSave} />
      </Modal>
      <Modal isOpen={modal === 'hapus'} onClose={closeModal} title="Hapus Pengguna" size="sm">
        <div className="pb-2 space-y-4">
          <div className="p-4 bg-error-container/30 rounded-xl border border-error/20 flex items-start gap-3">
            <span className="material-symbols-outlined text-error text-[28px] shrink-0">warning</span>
            <div>
              <p className="font-bold text-error">Hapus pengguna ini?</p>
              <p className="text-sm text-on-surface-variant mt-1">Akun <strong>{selectedUser?.nama_lengkap}</strong> akan dihapus permanen.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={closeModal} className="flex-1 h-12 rounded-xl border-2 border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors">Batal</button>
            <button onClick={handleDelete} className="flex-1 h-12 rounded-xl bg-error text-on-error font-bold hover:bg-error/90 transition-all shadow-md flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">delete</span>Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
