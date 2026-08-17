# SmartPosyandu - AI Context & Architecture

Dokumen ini adalah **panduan wajib** bagi AI atau developer baru agar dapat langsung memahami struktur, teknologi, dan pola pengembangan SmartPosyandu tanpa membaca ulang seluruh kode.

---

## 1. Tech Stack
| Layer | Teknologi | Catatan |
|---|---|---|
| Framework | React 18 (SPA) | Functional Components + Hooks |
| Build Tool | Vite | ESM native, sangat cepat |
| Routing | react-router-dom v6 | Nested routes, protected routes |
| Styling | **Tailwind CSS v4** | Integrasi via `@tailwindcss/vite` — **TANPA PostCSS** |
| Module Format | ES Modules | `"type": "module"` di `package.json` |

> **PENTING:** Tailwind CSS v4 sudah **tidak** menggunakan `tailwind.config.js` untuk variabel kustom. Semua design tokens (warna, spacing, font) didefinisikan di `src/index.css` menggunakan direktif `@theme` atau di `tailwind.config.js` dengan sintaks ESM `export default { ... }`.

---

## 2. Struktur Direktori
```
src/
├── components/
│   ├── Layout/
│   │   ├── PublicLayout.jsx    # Navbar minimalis & footer untuk halaman non-login
│   │   ├── AppLayout.jsx       # Sidebar (desktop) + BottomNav (mobile) + header
│   │   └── ProtectedRoute.jsx  # Guard RBAC: cek user.role sebelum render
│   └── UI/                     # ← BARU: komponen UI reusable
│       ├── Modal.jsx           # Dialog/modal universal (backdrop, ESC, animasi)
│       ├── Dropdown.jsx        # Context menu (3-titik), klik luar = tutup otomatis
│       └── Toast.jsx           # Notifikasi pop-up (auto-dismiss, 4 tipe)
├── context/
│   └── AuthContext.jsx         # State auth global: user, login(), logout()
├── pages/
│   ├── Landing.jsx             # Halaman publik utama / Pemasaran
│   ├── Login.jsx               # Halaman login (3 role dummy)
│   ├── Dashboard.jsx           # Beranda — modal Jadwal & Notifikasi aktif
│   ├── DataBalita.jsx          # Tabel peserta — CRUD modal penuh + search + dropdown
│   ├── Penimbangan.jsx         # Form pencatatan kesehatan
│   ├── Riwayat.jsx             # Timeline riwayat — klik item buka detail modal
│   ├── Laporan.jsx             # Laporan SKDN — modal WA, cetak PDF, toast export
│   ├── Users.jsx               # Manajemen Pengguna & Audit Trail (khusus Admin)
│   └── Settings.jsx            # Preferensi — toggle switch, simpan, reset modal
├── App.jsx                     # Definisi semua route + proteksi role
├── index.css                   # Entry CSS: @import "tailwindcss" + @config
└── main.jsx                    # Entry point React
```

---

## 3. Sistem RBAC (Role-Based Access Control)
Dikelola oleh `AuthContext.jsx`. Proteksi rute via `<ProtectedRoute allowedRoles={[...]}>` di `App.jsx`.

| Role | Akses |
|---|---|
| `administrator` | Semua halaman termasuk Manajemen User dan Settings |
| `kader` | Dashboard, Data Balita, Penimbangan, Riwayat, Laporan |
| `orang_tua` | Riwayat saja |

---

## 4. Pola Komponen UI (UI Primitives)

### Modal
```jsx
import Modal from '../components/UI/Modal';
// Props: isOpen, onClose, title, children, size='sm'|'md'|'lg'|'xl'
<Modal isOpen={modal === 'tambah'} onClose={closeModal} title="Judul" size="md">
  <KontenModal />
</Modal>
```
- Tutup otomatis: klik backdrop atau tekan `ESC`
- Mobile: slide dari bawah. Desktop: fade-in center.

### Dropdown (Context Menu)
```jsx
import Dropdown from '../components/UI/Dropdown';
// Props: trigger (ReactNode), items (array)
<Dropdown
  trigger={<button>⋮</button>}
  items={[
    { label: 'Edit', icon: 'edit', onClick: () => {} },
    { divider: true },
    { label: 'Hapus', icon: 'delete', danger: true, onClick: () => {} },
  ]}
/>
```

### Toast
```jsx
import Toast from '../components/UI/Toast';
// Props: message, type='success'|'error'|'info'|'warning', onClose, duration
{toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
```
Pola state:
```jsx
const [toast, setToast] = useState(null);
const showToast = (msg, type = 'success') => setToast({ msg, type });
```

---

## 5. Pola Pengembangan Halaman

### State Modal (standar di setiap page)
```jsx
const [modal, setModal] = useState(null); // null | 'tambah' | 'edit' | 'hapus'
const [selectedItem, setSelectedItem] = useState(null);
const closeModal = () => { setModal(null); setSelectedItem(null); };
```

### Ikon
Gunakan Google Material Symbols Outlined via class `material-symbols-outlined`.
Untuk ikon filled: `style={{ fontVariationSettings: "'FILL' 1" }}`

---

## 6. Design Tokens (Warna Utama)
| Token | Nilai Hex | Penggunaan |
|---|---|---|
| `primary` | `#006a40` | Aksi utama, brand hijau |
| `secondary` | `#0060ac` | Aksi sekunder, biru |
| `tertiary` | `#95414a` | Aksen peringatan, merah rose |
| `background` | `#f8f9ff` | Latar halaman |
| `surface-container-lowest` | `#ffffff` | Card/panel |
| `on-surface` | `#121c28` | Teks utama |
| `error` | `#ba1a1a` | Kondisi error/hapus |

---

## 7. Status Implementasi (terakhir diperbarui: 29 Mei 2025)

| Fitur | Status |
|---|---|
| Routing + RBAC | ✅ Selesai |
| PWA (Offline Support & Manifest) | ✅ Selesai |
| Halaman Publik / Landing Page | ✅ Selesai |
| Layout (Sidebar + BottomNav responsif) | ✅ Selesai |
| Semua halaman dikonversi ke React | ✅ Selesai |
| Komponen UI (Modal, Dropdown, Toast) | ✅ Selesai |
| Interaktivitas semua tombol (CRUD UI) | ✅ Selesai |
| Manajemen Pengguna & Audit Trail | ✅ Selesai |
| Form state management (tanpa backend) | ✅ Selesai |
| Integrasi Backend / API | ✅ Selesai (Node.js & Express) |
| Autentikasi nyata (bukan dummy) | ✅ Selesai (JWT, bcrypt, RBAC) |
| Database (simpan data permanen) | ✅ Selesai (MySQL) |
| PWA (offline support) | ❌ Belum |

---

## 8. Langkah Selanjutnya yang Direkomendasikan
1. **Hubungkan Frontend ke Backend API**: Ubah `AuthContext.jsx` dan state lokal di halaman React agar melakukan fetching data ke API (`server.cjs`) menggunakan `fetch` atau `axios`.
2. **Testing Integrasi**: Pastikan semua operasi CRUD tabel dapat disinkronkan dengan MySQL secara *real-time*.
3. **Tambahkan PWA** via Vite PWA plugin untuk dukungan offline (jika belum sepenuhnya stabil).

---

*Untuk sesi baru: baca dokumen ini terlebih dahulu sebelum membuat perubahan infrastruktur, routing, atau styling.*
