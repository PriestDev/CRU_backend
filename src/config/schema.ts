import pool from './database';

export const initializeDB = async () => {
  const connection = await pool.getConnection();
  
  try {
    // Create users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        role ENUM('student', 'staff', 'visitor') NOT NULL,
        password_hash VARCHAR(255),
        is_verified BOOLEAN DEFAULT false,
        verification_otp VARCHAR(6),
        otp_expiry DATETIME,
        reset_token VARCHAR(100),
        reset_token_expiry DATETIME,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `);

    // Add reset_token column if it doesn't exist
    try {
      await connection.execute(`
        ALTER TABLE users ADD COLUMN reset_token VARCHAR(100) DEFAULT NULL
      `);
    } catch (error: any) {
      // Column already exists, ignore error
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error;
      }
    }

    // Add reset_token_expiry column if it doesn't exist
    try {
      await connection.execute(`
        ALTER TABLE users ADD COLUMN reset_token_expiry DATETIME DEFAULT NULL
      `);
    } catch (error: any) {
      // Column already exists, ignore error
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error;
      }
    }
    
    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    connection.release();
  }
};
