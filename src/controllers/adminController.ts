import { Request, Response } from 'express';
import pool from '../config/database';

const toRole = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const roles = ['student', 'staff', 'driver', 'visitor'];
  return roles.includes(value) ? value : null;
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
