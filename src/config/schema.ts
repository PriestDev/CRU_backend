import pool from './database';

export const initializeDB = async () => {
  const connection = await pool.getConnection();

  try {
    // Create users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        role ENUM('student', 'staff', 'driver', 'visitor') NOT NULL,
        password_hash VARCHAR(255),
        first_name VARCHAR(100) DEFAULT NULL,
        last_name VARCHAR(100) DEFAULT NULL,
        phone_number VARCHAR(50) DEFAULT NULL,
        campus_id VARCHAR(100) DEFAULT NULL,
        profile_picture_url VARCHAR(255) DEFAULT NULL,
        address TEXT DEFAULT NULL,
        is_verified BOOLEAN DEFAULT false,
        verification_otp VARCHAR(6) DEFAULT NULL,
        otp_expiry DATETIME DEFAULT NULL,
        reset_token VARCHAR(100) DEFAULT NULL,
        reset_token_expiry DATETIME DEFAULT NULL,
        ip_address VARCHAR(45) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure additional profile columns exist for legacy installs
    const optionalUserColumns = [
      { name: 'first_name', definition: 'VARCHAR(100) DEFAULT NULL' },
      { name: 'last_name', definition: 'VARCHAR(100) DEFAULT NULL' },
      { name: 'phone_number', definition: 'VARCHAR(50) DEFAULT NULL' },
      { name: 'campus_id', definition: 'VARCHAR(100) DEFAULT NULL' },
      { name: 'profile_picture_url', definition: 'VARCHAR(255) DEFAULT NULL' },
      { name: 'address', definition: 'TEXT DEFAULT NULL' },
    ];

    for (const column of optionalUserColumns) {
      try {
        await connection.execute(`ALTER TABLE users ADD COLUMN ${column.name} ${column.definition}`);
      } catch (error: any) {
        if (error.code !== 'ER_DUP_FIELDNAME') {
          throw error;
        }
      }
    }

    try {
      await connection.execute(`
        ALTER TABLE users MODIFY COLUMN role ENUM('student', 'staff', 'driver', 'visitor') NOT NULL
      `);
    } catch (error: any) {
      // Ignore unsupported or already-modified role definitions
      if (error.code !== 'ER_DUP_FIELDNAME' && error.code !== 'ER_BAD_FIELD_ERROR') {
        throw error;
      }
    }

    // Create emergency contacts table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS emergency_contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(50) NOT NULL,
        relationship ENUM('Parent', 'Friend', 'Guardian') NOT NULL,
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_emergency_user (user_id),
        CONSTRAINT fk_emergency_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create bookings table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        booking_type ENUM('oneWay', 'roundTrip', 'multiStop', 'schedule') NOT NULL,
        ride_option ENUM('standard', 'carpool') NOT NULL DEFAULT 'standard',
        passengers INT NOT NULL DEFAULT 1,
        from_location VARCHAR(255) NOT NULL,
        to_location VARCHAR(255) NOT NULL,
        stops TEXT DEFAULT NULL,
        pickup_date DATE DEFAULT NULL,
        pickup_time TIME DEFAULT NULL,
        return_date DATE DEFAULT NULL,
        return_time TIME DEFAULT NULL,
        note TEXT DEFAULT NULL,
        estimated_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_booking_user (user_id),
        CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create payment methods table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        method_type ENUM('card', 'wallet', 'bank_transfer', 'mobile_money') NOT NULL DEFAULT 'card',
        provider VARCHAR(100) DEFAULT NULL,
        last4 VARCHAR(4) DEFAULT NULL,
        expiry_month TINYINT UNSIGNED DEFAULT NULL,
        expiry_year SMALLINT UNSIGNED DEFAULT NULL,
        default_method BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_payment_user (user_id),
        CONSTRAINT fk_payment_methods_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create ride payments table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ride_payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        user_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        currency CHAR(3) NOT NULL DEFAULT 'NGN',
        status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
        payment_method_id INT DEFAULT NULL,
        payment_reference VARCHAR(255) DEFAULT NULL,
        paid_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_payment_booking (booking_id),
        INDEX idx_payment_user (user_id),
        CONSTRAINT fk_ride_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        CONSTRAINT fk_ride_payments_method FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL,
        CONSTRAINT fk_ride_payments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create ride ratings table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ride_ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        user_id INT NOT NULL,
        rating TINYINT UNSIGNED NOT NULL,
        comment TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_rating_booking (booking_id),
        CONSTRAINT fk_rating_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create ride tracking table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ride_tracking (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        latitude DECIMAL(10,7) NOT NULL,
        longitude DECIMAL(10,7) NOT NULL,
        status VARCHAR(100) NOT NULL,
        recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_tracking_booking (booking_id),
        CONSTRAINT fk_tracking_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    connection.release();
  }
};
