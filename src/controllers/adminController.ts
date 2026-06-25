import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import pool from '../config/database';

const toRole = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const roles = ['student', 'staff', 'driver', 'visitor'];
  return roles.includes(value) ? value : null;
};

export const createAdminUser = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const { email, full_name, password, role, is_verified } = req.body;
    const requestedRole = toRole(role);

    if (!email || !password || !requestedRole) {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
      return;
    }

    const [existingRows] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (Array.isArray(existingRows) && existingRows.length > 0) {
      res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
      return;
    }

    const passwordHash = await bcryptjs.hash(String(password), 10);
    const verified = typeof is_verified === 'boolean' ? is_verified : true;

    const [result] = await connection.execute(
      'INSERT INTO users (email, role, password_hash, full_name, is_verified) VALUES (?, ?, ?, ?, ?)',
      [email, requestedRole, passwordHash, full_name || null, verified]
    );

    const insertedId = (result as any).insertId;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: insertedId,
          name: full_name || email,
          email,
          role: requestedRole,
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
      ? 'SELECT id, email, role, full_name, phone_number, campus_id, is_verified, created_at FROM users WHERE role = ? ORDER BY created_at DESC'
      : 'SELECT id, email, role, full_name, phone_number, campus_id, is_verified, created_at FROM users ORDER BY created_at DESC';
    const params = requestedRole ? [requestedRole] : [];

    const [rows] = await connection.execute(query, params);

    const users = (rows as any[]).map((user) => ({
      id: user.id,
      name: user.full_name || user.email,
      email: user.email,
      role: user.role,
      status: user.is_verified ? 'Active' : 'Pending',
      phoneNumber: user.phone_number || null,
      campusId: user.campus_id || null,
      createdAt: user.created_at,
    }));

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
        driver_name,
        vehicle_type,
        status,
        created_at
      FROM carpools
      ORDER BY created_at DESC`
    );

    const vehicles = (rows as any[]).map((vehicle) => ({
      id: vehicle.id,
      vehicleId: `${vehicle.vehicle_type?.substring(0, 2).toUpperCase()}-${String(vehicle.id).padStart(3, '0')}`,
      status: vehicle.status === 'open' ? 'EN ROUTE' : vehicle.status === 'closed' ? 'STANDBY' : 'MAINTENANCE',
      driver: vehicle.driver_name || 'Automated',
      vehicle: vehicle.vehicle_type || 'Unknown',
      occupancy: Math.floor(Math.random() * 100),
    }));

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
