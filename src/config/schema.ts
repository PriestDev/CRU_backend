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
        full_name VARCHAR(255) DEFAULT NULL,
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
      { name: 'full_name', definition: 'VARCHAR(255) DEFAULT NULL' },
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

    const droppedColumns = ['first_name', 'last_name'];
    for (const column of droppedColumns) {
      try {
        await connection.execute(`ALTER TABLE users DROP COLUMN ${column}`);
      } catch (error: any) {
        if (error.code !== 'ER_CANT_DROP_FIELD_OR_KEY' && error.code !== 'ER_BAD_FIELD_ERROR') {
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

    // Create SOS alerts table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sos_alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        note TEXT DEFAULT NULL,
        latitude DECIMAL(10,7) DEFAULT NULL,
        longitude DECIMAL(10,7) DEFAULT NULL,
        contacts_count INT NOT NULL DEFAULT 0,
        contacts_snapshot JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_sos_user (user_id),
        CONSTRAINT fk_sos_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

    // Create delivery orders table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS deliveries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT NULL,
        delivery_type ENUM('food', 'docs', 'other') NOT NULL DEFAULT 'other',
        pickup_location VARCHAR(255) NOT NULL,
        dropoff_location VARCHAR(255) NOT NULL,
        note TEXT DEFAULT NULL,
        estimated_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        estimated_minutes INT NOT NULL DEFAULT 0,
        status ENUM('pending', 'picked_up', 'in_transit', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_delivery_status (status),
        INDEX idx_delivery_user (user_id),
        CONSTRAINT fk_delivery_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create wallet accounts table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wallet_accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        wallet_code VARCHAR(50) NOT NULL UNIQUE,
        user_id INT DEFAULT NULL,
        balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        currency CHAR(3) NOT NULL DEFAULT 'NGN',
        status ENUM('active', 'frozen', 'closed') NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_wallet_user (user_id),
        CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create wallet transactions table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        wallet_account_id INT NOT NULL,
        user_id INT DEFAULT NULL,
        transaction_type ENUM('fund', 'withdraw', 'payment', 'refund') NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        balance_before DECIMAL(12,2) NOT NULL,
        balance_after DECIMAL(12,2) NOT NULL,
        reference VARCHAR(100) NOT NULL,
        description VARCHAR(255) DEFAULT NULL,
        status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'completed',
        metadata JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_wallet_tx_wallet (wallet_account_id),
        INDEX idx_wallet_tx_user (user_id),
        INDEX idx_wallet_tx_type (transaction_type),
        CONSTRAINT fk_wallet_tx_wallet FOREIGN KEY (wallet_account_id) REFERENCES wallet_accounts(id) ON DELETE CASCADE,
        CONSTRAINT fk_wallet_tx_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Wallet accounts are created on demand per authenticated user.

    // Create carpools table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS carpools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trip_code VARCHAR(20) NOT NULL UNIQUE,
        driver_name VARCHAR(255) NOT NULL,
        driver_image VARCHAR(255) NOT NULL,
        rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
        total_rides INT NOT NULL DEFAULT 0,
        from_location VARCHAR(255) NOT NULL,
        to_location VARCHAR(255) NOT NULL,
        departure_time TIME NOT NULL,
        arrival_time TIME NOT NULL,
        price_per_seat DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        seats_total TINYINT UNSIGNED NOT NULL DEFAULT 4,
        seats_booked TINYINT UNSIGNED NOT NULL DEFAULT 0,
        vehicle_type VARCHAR(100) NOT NULL,
        gender_preference ENUM('male', 'female', 'any') NOT NULL DEFAULT 'any',
        music_allowed BOOLEAN NOT NULL DEFAULT true,
        ac_available BOOLEAN NOT NULL DEFAULT false,
        status ENUM('open', 'full', 'cancelled') NOT NULL DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_carpool_status (status),
        INDEX idx_carpool_route (from_location, to_location)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS carpool_participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        carpool_id INT NOT NULL,
        user_id INT DEFAULT NULL,
        passenger_name VARCHAR(255) DEFAULT NULL,
        seats_booked TINYINT UNSIGNED NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_carpool_participant_carpool (carpool_id),
        INDEX idx_carpool_participant_user (user_id),
        CONSTRAINT fk_carpool_participant_carpool FOREIGN KEY (carpool_id) REFERENCES carpools(id) ON DELETE CASCADE,
        CONSTRAINT fk_carpool_participant_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [existingCarpoolRows] = await connection.execute(`SELECT COUNT(*) AS total FROM carpools`);
    const existingCount = Array.isArray(existingCarpoolRows) && existingCarpoolRows.length > 0
      ? Number((existingCarpoolRows[0] as any).total) || 0
      : 0;

    if (existingCount === 0) {
      await connection.execute(
        `INSERT INTO carpools (
          trip_code,
          driver_name,
          driver_image,
          rating,
          total_rides,
          from_location,
          to_location,
          departure_time,
          arrival_time,
          price_per_seat,
          seats_total,
          seats_booked,
          vehicle_type,
          gender_preference,
          music_allowed,
          ac_available,
          status
        ) VALUES
          ('CP001', 'Alex Rivers', 'https://placehold.net/avatar-4.svg', 4.9, 124, 'Main Campus North Gate', 'Downtown Tech Hub', '08:30:00', '09:15:00', 5.50, 4, 2, 'Electric Keke', 'any', true, false, 'open'),
          ('CP002', 'Sarah Miles', 'https://placehold.net/avatar-4.svg', 4.7, 89, 'Rumuola', 'GRA Phase 3', '07:45:00', '08:20:00', 8.00, 4, 3, 'Sedan', 'female', true, true, 'open')`
      );
    }

    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    connection.release();
  }
};
