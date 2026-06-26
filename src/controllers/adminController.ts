import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import pool from '../config/database';
import { validatePhoneNumber } from '../utils/helpers';

const toRole = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const roles = ['student', 'staff', 'driver', 'visitor'];
  return roles.includes(value) ? value : null;
};

const generateUniqueRiderId = async (connection: any, preferredId?: string | null) => {
  const trimmedPreferredId = typeof preferredId === 'string' ? preferredId.trim() : '';

  if (trimmedPreferredId) {
    const [existingRows] = await connection.execute(
      'SELECT id FROM users WHERE rider_id = ? OR campus_id = ? LIMIT 1',
      [trimmedPreferredId, trimmedPreferredId]
    );
    if (Array.isArray(existingRows) && existingRows.length === 0) {
      return trimmedPreferredId;
    }
  }

  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  const buildCandidate = () => {
    const randomPart = Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
    return `RID-${datePart}-${randomPart}`;
  };

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = buildCandidate();
    const [existingRows] = await connection.execute(
      'SELECT id FROM users WHERE rider_id = ? OR campus_id = ? LIMIT 1',
      [candidate, candidate]
    );

    if (Array.isArray(existingRows) && existingRows.length === 0) {
      return candidate;
    }
  }

  return `RID-${datePart}-${Date.now().toString(36).toUpperCase()}`;
};

export const createAdminUser = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const {
      email,
      full_name,
      password,
      role,
      is_verified,
      phone_number,
      phoneNumber,
      rider_id,
      riderId,
    } = req.body;
    const requestedRole = toRole(role);
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedFullName = typeof full_name === 'string' ? full_name.trim() : '';
    const normalizedPhone = typeof phone_number === 'string' && phone_number.trim()
      ? phone_number.trim()
      : typeof phoneNumber === 'string' && phoneNumber.trim()
        ? phoneNumber.trim()
        : '';
    const preferredRiderId = typeof rider_id === 'string' ? rider_id.trim() : typeof riderId === 'string' ? riderId.trim() : '';

    if (!normalizedEmail || !password || !requestedRole) {
      res.status(400).json({
        success: false,
        message: 'Email, password, and role are required',
      });
      return;
    }

    if (!['staff', 'driver'].includes(requestedRole)) {
      res.status(400).json({
        success: false,
        message: 'Only staff and driver accounts can be created from the admin panel',
      });
      return;
    }

    if (requestedRole === 'driver' && normalizedPhone && !validatePhoneNumber(normalizedPhone)) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
      return;
    }

    const [existingRows] = await connection.execute(
      `SELECT id FROM users WHERE email = ?${normalizedPhone ? ' OR phone_number = ?' : ''}`,
      normalizedPhone ? [normalizedEmail, normalizedPhone] : [normalizedEmail]
    );
    if (Array.isArray(existingRows) && existingRows.length > 0) {
      res.status(409).json({
        success: false,
        message: 'An account with this email or phone number already exists',
      });
      return;
    }

    const passwordHash = await bcryptjs.hash(String(password), 10);
    const verified = typeof is_verified === 'boolean' ? is_verified : true;
    const generatedRiderId = requestedRole === 'driver' ? await generateUniqueRiderId(connection, preferredRiderId) : null;

    const [result] = await connection.execute(
      'INSERT INTO users (email, role, password_hash, full_name, phone_number, campus_id, rider_id, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [normalizedEmail, requestedRole, passwordHash, normalizedFullName || null, normalizedPhone || null, generatedRiderId, generatedRiderId, verified]
    );

    const insertedId = (result as any).insertId;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: insertedId,
          name: normalizedFullName || normalizedEmail,
          email: normalizedEmail,
          role: requestedRole,
          phoneNumber: normalizedPhone || null,
          riderId: generatedRiderId,
          campusId: generatedRiderId,
          status: verified ? 'Active' : 'Pending',
          createdAt: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const updateAdminUser = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const userId = Number(req.params.id);
    const {
      full_name,
      email,
      phone_number,
      phoneNumber,
      rider_id,
      riderId,
      vehicle_model,
      vehicleModel,
      vehicle_plate_number,
      vehiclePlateNumber,
      plateNumber,
      password,
      status,
      is_verified,
    } = req.body;

    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    const normalizedFullName = typeof full_name === 'string' && full_name.trim() ? full_name.trim() : null;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedPhone = typeof phone_number === 'string' && phone_number.trim()
      ? phone_number.trim()
      : typeof phoneNumber === 'string' && phoneNumber.trim()
        ? phoneNumber.trim()
        : null;
    const normalizedRiderId = typeof rider_id === 'string' && rider_id.trim()
      ? rider_id.trim()
      : typeof riderId === 'string' && riderId.trim()
        ? riderId.trim()
        : null;
    const normalizedVehicleModel = typeof vehicle_model === 'string' && vehicle_model.trim()
      ? vehicle_model.trim()
      : typeof vehicleModel === 'string' && vehicleModel.trim()
        ? vehicleModel.trim()
        : null;
    const normalizedVehiclePlateNumber = typeof vehicle_plate_number === 'string' && vehicle_plate_number.trim()
      ? vehicle_plate_number.trim()
      : typeof vehiclePlateNumber === 'string' && vehiclePlateNumber.trim()
        ? vehiclePlateNumber.trim()
        : typeof plateNumber === 'string' && plateNumber.trim()
          ? plateNumber.trim()
          : null;
    const normalizedStatus = typeof status === 'string' && status.trim() ? status.trim() : 'Active';
    const verified = typeof is_verified === 'boolean' ? is_verified : normalizedStatus !== 'Pending' && normalizedStatus !== 'Suspended';

    if (!normalizedEmail) {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }

    const [existingRows] = await connection.execute('SELECT id, email, full_name, phone_number, rider_id, campus_id, vehicle_model, vehicle_plate_number FROM users WHERE id = ?', [userId]);
    const existingUsers = Array.isArray(existingRows) ? existingRows as any[] : [];
    if (existingUsers.length === 0) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      res.status(400).json({ success: false, message: 'Invalid email format' });
      return;
    }

    let passwordHash: string | null = null;
    if (typeof password === 'string' && password.trim().length > 0) {
      if (password.trim().length < 6) {
        res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        return;
      }
      passwordHash = await bcryptjs.hash(password, 10);
    }

    const updateFields: string[] = ['full_name = ?', 'email = ?', 'phone_number = ?', 'is_verified = ?'];
    const updateValues: any[] = [normalizedFullName, normalizedEmail, normalizedPhone, verified];

    if (normalizedRiderId) {
      updateFields.push('rider_id = ?');
      updateFields.push('campus_id = ?');
      updateValues.push(normalizedRiderId, normalizedRiderId);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'vehicle_model') || Object.prototype.hasOwnProperty.call(req.body, 'vehicleModel')) {
      updateFields.push('vehicle_model = ?');
      updateValues.push(normalizedVehicleModel);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'vehicle_plate_number') || Object.prototype.hasOwnProperty.call(req.body, 'vehiclePlateNumber') || Object.prototype.hasOwnProperty.call(req.body, 'plateNumber')) {
      updateFields.push('vehicle_plate_number = ?');
      updateValues.push(normalizedVehiclePlateNumber);
    }

    if (passwordHash) {
      updateFields.push('password_hash = ?');
      updateValues.push(passwordHash);
    }

    updateValues.push(userId);

    await connection.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues,
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: {
          id: userId,
          name: normalizedFullName || existingUsers[0].full_name || normalizedEmail,
          email: normalizedEmail,
          phoneNumber: normalizedPhone,
          riderId: normalizedRiderId || existingUsers[0].rider_id || existingUsers[0].campus_id || null,
          campusId: normalizedRiderId || existingUsers[0].campus_id || existingUsers[0].rider_id || null,
          vehicleModel: normalizedVehicleModel ?? existingUsers[0].vehicle_model ?? null,
          vehiclePlateNumber: normalizedVehiclePlateNumber ?? existingUsers[0].vehicle_plate_number ?? null,
          status: normalizedStatus,
          createdAt: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Update admin user error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const getAdminDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const [userRows] = await connection.execute(
      `SELECT role, COUNT(*) AS count FROM users GROUP BY role`
    );
    const [bookingRows] = await connection.execute(
      `SELECT status, COUNT(*) AS count FROM bookings GROUP BY status`
    );
    const [carpoolRows] = await connection.execute(
      `SELECT status, COUNT(*) AS count FROM carpools GROUP BY status`
    );
    const [ratingRows] = await connection.execute(
      `SELECT COALESCE(AVG(rating), 0) AS average_rating FROM ride_ratings`
    );
    const [revenueRows] = await connection.execute(
      `SELECT COALESCE(SUM(CASE WHEN transaction_type = 'payment' AND status = 'completed' THEN amount ELSE 0 END), 0) AS revenue
       FROM wallet_transactions`
    );

    const roleMap = Array.isArray(userRows)
      ? userRows.reduce((acc: Record<string, number>, row: any) => {
          acc[row.role] = Number(row.count || 0);
          return acc;
        }, {})
      : {};

    const bookingMap = Array.isArray(bookingRows)
      ? bookingRows.reduce((acc: Record<string, number>, row: any) => {
          acc[row.status] = Number(row.count || 0);
          return acc;
        }, {})
      : {};

    const carpoolMap = Array.isArray(carpoolRows)
      ? carpoolRows.reduce((acc: Record<string, number>, row: any) => {
          acc[row.status] = Number(row.count || 0);
          return acc;
        }, {})
      : {};

    const averageRating = Number((ratingRows as any[])[0]?.average_rating || 0);
    const revenue = Number((revenueRows as any[])[0]?.revenue || 0);

    res.status(200).json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: {
        totalRides: Object.values(bookingMap).reduce((sum, count) => sum + count, 0),
        activeRiders: roleMap.driver || 0,
        systemRating: Number(averageRating.toFixed(1)),
        revenue,
        bookingStatus: bookingMap,
        carpoolStatus: carpoolMap,
        usersByRole: roleMap,
      },
    });
  } catch (error) {
    console.error('Get admin dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving dashboard stats',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const getAdminUsers = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const requestedRole = toRole(req.query.role);
    const query = requestedRole
      ? 'SELECT id, email, role, full_name, phone_number, campus_id, rider_id, vehicle_model, vehicle_plate_number, is_verified, created_at FROM users WHERE role = ? ORDER BY created_at DESC'
      : 'SELECT id, email, role, full_name, phone_number, campus_id, rider_id, vehicle_model, vehicle_plate_number, is_verified, created_at FROM users ORDER BY created_at DESC';
    const params = requestedRole ? [requestedRole] : [];

    const [rows] = await connection.execute(query, params);

    const users = (rows as any[]).map((user) => ({
      id: user.id,
      name: user.full_name || user.email,
      email: user.email,
      role: user.role,
      status: user.is_verified ? 'Active' : 'Pending',
      phoneNumber: user.phone_number || null,
      campusId: user.campus_id || user.rider_id || null,
      riderId: user.rider_id || user.campus_id || null,
      vehicleModel: user.vehicle_model || null,
      vehiclePlateNumber: user.vehicle_plate_number || null,
      createdAt: user.created_at,
    }));

    for (const user of users.filter((item) => item.role === 'driver' && !item.riderId)) {
      const fallbackRiderId = await generateUniqueRiderId(connection, null);
      await connection.execute(
        'UPDATE users SET rider_id = ?, campus_id = ? WHERE id = ?',
        [fallbackRiderId, fallbackRiderId, user.id]
      );
      user.riderId = fallbackRiderId;
      user.campusId = fallbackRiderId;
    }

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
      },
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving users',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const getAdminBookings = async (_req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT
        b.id,
        b.user_id,
        u.full_name AS passenger_name,
        b.booking_type,
        b.ride_option,
        b.from_location,
        b.to_location,
        b.estimated_price,
        b.status,
        b.pickup_date,
        b.pickup_time,
        b.created_at,
        c.driver_name,
        c.vehicle_type,
        c.status AS carpool_status
      FROM bookings b
      LEFT JOIN users u ON u.id = b.user_id
      LEFT JOIN carpools c ON c.booking_id = b.id
      ORDER BY b.created_at DESC`
    );

    const bookings = (rows as any[]).map((booking) => ({
      id: booking.id,
      student: booking.passenger_name || `Passenger ${booking.user_id}`,
      rider: booking.driver_name || 'Unassigned',
      vehicle: booking.vehicle_type || (booking.carpool_status === 'open' ? 'Carpool Match' : 'Pending matching...'),
      route: `${booking.from_location || 'Unknown'} → ${booking.to_location || 'Unknown'}`,
      fare: booking.estimated_price ? `₦${Number(booking.estimated_price).toFixed(2)}` : '₦0.00',
      status: booking.status,
      date: booking.created_at,
      bookingType: booking.booking_type,
      rideOption: booking.ride_option,
    }));

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: {
        bookings,
      },
    });
  } catch (error) {
    console.error('Get admin bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving bookings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const getAdminTransactions = async (_req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT
        wt.id,
        wt.transaction_type,
        wt.amount,
        wt.status,
        wt.reference,
        wt.description,
        wt.created_at,
        u.full_name AS user_name,
        u.email AS user_email
      FROM wallet_transactions wt
      LEFT JOIN users u ON u.id = wt.user_id
      ORDER BY wt.created_at DESC`
    );

    const transactions = (rows as any[]).map((transaction) => ({
      id: transaction.reference || `TXN-${transaction.id}`,
      type: transaction.transaction_type === 'fund'
        ? 'Top-up'
        : transaction.transaction_type === 'withdraw'
          ? 'Withdrawal'
          : 'Payment',
      amount: Number(transaction.amount || 0),
      status: transaction.status === 'completed'
        ? 'Completed'
        : transaction.status === 'pending'
          ? 'Pending'
          : 'Failed',
      date: transaction.created_at,
      userName: transaction.user_name || transaction.user_email || 'Unknown User',
      description: transaction.description || null,
    }));

    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        transactions,
      },
    });
  } catch (error) {
    console.error('Get admin transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving transactions',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const getAdminFleet = async (_req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT
        id,
        trip_code,
        driver_name,
        vehicle_type,
        status,
        seats_total,
        seats_booked,
        price_per_seat,
        from_location,
        to_location,
        departure_time,
        arrival_time,
        created_at
      FROM carpools
      ORDER BY created_at DESC`
    );

    const vehicles = (rows as any[]).map((vehicle) => {
      const totalSeats = Number(vehicle.seats_total || 0);
      const bookedSeats = Number(vehicle.seats_booked || 0);
      const occupancy = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;
      const statusValue = vehicle.status === 'full'
        ? 'FULL'
        : vehicle.status === 'cancelled'
          ? 'CANCELLED'
          : occupancy >= 60
            ? 'EN ROUTE'
            : 'STANDBY';

      return {
        id: vehicle.id,
        vehicleId: vehicle.trip_code || `${(vehicle.vehicle_type || 'VEH').toString().substring(0, 2).toUpperCase()}-${String(vehicle.id).padStart(3, '0')}`,
        status: statusValue,
        driver: vehicle.driver_name || 'Automated',
        vehicle: vehicle.vehicle_type || 'Unknown',
        occupancy,
        route: [vehicle.from_location, vehicle.to_location].filter(Boolean).join(' → ') || 'Route pending',
        departureTime: vehicle.departure_time || null,
        arrivalTime: vehicle.arrival_time || null,
        seatsBooked: bookedSeats,
        seatsTotal: totalSeats,
        pricePerSeat: Number(vehicle.price_per_seat || 0),
        createdAt: vehicle.created_at,
      };
    });

    res.status(200).json({
      success: true,
      message: 'Fleet retrieved successfully',
      data: {
        vehicles,
      },
    });
  } catch (error) {
    console.error('Get admin fleet error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving fleet data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};
