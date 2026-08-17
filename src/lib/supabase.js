// ============================================================
// SmartPosyandu - Database Adapter (MySQL Backend)
// ============================================================

const SESSION_KEY = 'smartposyandu_session';
const TOKEN_KEY = 'smartposyandu_token';
const PROFILES_KEY = 'smartposyandu_profiles';

// Event listeners untuk auth state

const authListeners = new Set();

const notifyAuthChange = (event, session) => {
  authListeners.forEach(cb => {
    try { cb(event, session); } catch (e) {}
  });
};

const API_BASE_URL = 'http://localhost:3001/api';

class LocalQueryBuilder {
  constructor(tableName) {
    this.tableName = tableName;
    this.isSingle = false;
    this.filters = [];
    this.sortConfig = null;
    this.action = 'select'; // 'select' | 'insert' | 'update' | 'delete'
    this.insertPayload = null;
    this.updatePayload = null;
  }

  select(fields = '*') {
    this.action = 'select';
    return this;
  }

  order(field, { ascending = true } = {}) {
    this.sortConfig = { field, ascending };
    return this;
  }

  eq(field, value) {
    this.filters.push({ field, value });
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  insert(data) {
    this.action = 'insert';
    this.insertPayload = Array.isArray(data) ? data : [data];
    return this;
  }

  update(data) {
    this.action = 'update';
    this.updatePayload = data;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  // Standard Promise thenable untuk request ke backend API MySQL
  async then(resolve, reject) {
    try {
      // Tambahkan ID dinamis jika insert
      if (this.action === 'insert') {
        this.insertPayload = this.insertPayload.map(item => ({
          id: item.id || `loc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
          ...item
        }));
      }

      // Ambil JWT token dari localStorage untuk dikirim ke server
      const token = localStorage.getItem(TOKEN_KEY);
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          table: this.tableName,
          action: this.action,
          filters: this.filters,
          payload: this.action === 'insert' ? this.insertPayload : this.updatePayload,
          sortConfig: this.sortConfig,
          isSingle: this.isSingle
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        // Jika 401 (token expired/invalid), paksa logout
        if (response.status === 401) {
          localStorage.removeItem(SESSION_KEY);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(PROFILES_KEY);
          notifyAuthChange('SIGNED_OUT', null);
        }
        throw new Error(errJson.error || 'Request gagal');
      }

      const result = await response.json();
      resolve(result);
    } catch (err) {
      console.error(`Error backend query pada ${this.tableName}:`, err);
      resolve({ data: this.action === 'select' ? (this.isSingle ? null : []) : null, error: err.message });
    }
  }
}

export const supabase = {
  auth: {
    async getSession() {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return { data: { session: null }, error: null };
      try {
        const session = JSON.parse(raw);
        return { data: { session }, error: null };
      } catch (e) {
        return { data: { session: null }, error: null };
      }
    },

    async signInWithPassword({ email, password }) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          const errJson = await response.json();
          throw new Error(errJson.error || 'Email atau password salah');
        }

        const result = await response.json();
        
        // Simpan JWT token asli dari server
        const access_token = result.access_token;
        localStorage.setItem(TOKEN_KEY, access_token);

        const session = {
          user: result.user,
          access_token,
          expires_at: Date.now() + 86400000
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        // Simpan juga profile
        localStorage.setItem(PROFILES_KEY, JSON.stringify(result.profile));
        notifyAuthChange('SIGNED_IN', session);

        return { data: { user: session.user, session }, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    async signOut() {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PROFILES_KEY);
      notifyAuthChange('SIGNED_OUT', null);
      return { error: null };
    },

    onAuthStateChange(callback) {
      authListeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListeners.delete(callback);
            }
          }
        }
      };
    }
  },

  from(tableName) {
    return new LocalQueryBuilder(tableName);
  }
};
