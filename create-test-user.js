const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'campus_ride_uniport'
  });

  try {
    // Hash password
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Insert test user
    const query = `
      INSERT IGNORE INTO users 
      (email, role, password_hash, full_name, is_verified, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const result = await connection.execute(query, [
      'test@uniport.edu.ng',
      'student',
      passwordHash,
      'Test Student',
      true  // is_verified = true
    ]);

    console.log('✅ Test user created successfully');
    console.log('Email: test@uniport.edu.ng');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    await connection.end();
  }
}

createTestUser();
