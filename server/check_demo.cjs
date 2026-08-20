const { queryAsync, db } = require('./config/db.cjs');
const bcrypt = require('bcryptjs');

async function checkPassword() {
  try {
    const rows = await queryAsync(
      "SELECT id, email, nama_lengkap, role, password FROM profiles WHERE email IN ('admin@smartposyandu.id', 'kader@smartposyandu.id')"
    );
    
    for (const u of rows) {
      const isHashed = u.password && (u.password.startsWith('$2b$') || u.password.startsWith('$2a$'));
      console.log(`\n[${u.role}] ${u.email}`);
      console.log(`  Password stored: ${isHashed ? 'bcrypt hash' : `plain text: "${u.password}"`}`);
      
      if (isHashed) {
        const matchA = await bcrypt.compare('password', u.password);
        const matchB = await bcrypt.compare('demo123', u.password);
        const matchC = await bcrypt.compare('Password', u.password);
        console.log(`  bcrypt.compare('password') -> ${matchA}`);
        console.log(`  bcrypt.compare('demo123')  -> ${matchB}`);
        console.log(`  bcrypt.compare('Password') -> ${matchC}`);
      } else {
        console.log(`  Plain 'password' match: ${u.password === 'password'}`);
      }
    }
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    db.end();
  }
}
checkPassword();
