import { Request, Response } from 'express';
import pool from '../config/database';

// Record ride location/tracking update
export const recordTracking = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const { bookingId, latitude, longitude, status } = req.body;

    // Validate input
    if (!bookingId || latitude === undefined || longitude === undefined) {
      res.status(400).json({
        success: false,
        message: 'bookingId, latitude, and longitude are required',
      });
      return;
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude coordinates',
      });
      return;
    }

    // Check if booking exists
    const bookingIdNum = parseInt(bookingId as string, 10);
    if (Number.isNaN(bookingIdNum)) {
      res.status(400).json({
        success: false,
        message: 'Invalid bookingId',
      });
      return;
    }

    const [bookings] = await connection.execute(
      'SELECT * FROM bookings WHERE id = ?',
      [bookingIdNum]
    );

    if (!Array.isArray(bookings) || bookings.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    // Insert tracking record
    await connection.execute(
      'INSERT INTO ride_tracking (booking_id, latitude, longitude, status) VALUES (?, ?, ?, ?)',
      [bookingIdNum, latitude, longitude, status || 'in_transit']
    );

    res.status(201).json({
      success: true,
      message: 'Tracking location recorded successfully',
      data: {
        bookingId,
        latitude,
        longitude,
        status: status || 'in_transit',
      },
    });
  } catch (error) {
    console.error('Record tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while recording tracking',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

// Get ride tracking history
export const getTracking = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const bookingId = parseInt(req.query.bookingId as string, 10);

    if (Number.isNaN(bookingId)) {
      res.status(400).json({
        success: false,
        message: 'bookingId is required and must be a number',
      });
      return;
    }

    // Check if booking exists
    const [bookings] = await connection.execute(
      'SELECT id, from_location, to_location, status FROM bookings WHERE id = ?',
      [bookingId]
    );

    if (!Array.isArray(bookings) || bookings.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    const booking = (bookings as any[])[0];

    // Get all tracking points for this ride
    const [trackingPoints] = await connection.execute(
      'SELECT * FROM ride_tracking WHERE booking_id = ? ORDER BY recorded_at ASC',
      [bookingId]
    );

    // Get latest tracking point
    const [latestTracking] = await connection.execute(
      'SELECT * FROM ride_tracking WHERE booking_id = ? ORDER BY recorded_at DESC LIMIT 1',
      [bookingId]
    );

    const latest = Array.isArray(latestTracking) && latestTracking.length > 0 
      ? (latestTracking as any[])[0] 
      : null;

    res.status(200).json({
      success: true,
      message: 'Tracking history retrieved successfully',
      data: {
        booking: {
          id: booking.id,
          from: booking.from_location,
          to: booking.to_location,
          status: booking.status,
        },
        currentLocation: latest ? {
          latitude: latest.latitude,
          longitude: latest.longitude,
          status: latest.status,
          recordedAt: latest.recorded_at,
        } : null,
        route: trackingPoints || [],
        totalPoints: Array.isArray(trackingPoints) ? trackingPoints.length : 0,
      },
    });
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving tracking',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

// Get latest location for a ride
export const getLatestLocation = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const bookingId = parseInt(req.query.bookingId as string, 10);

    if (Number.isNaN(bookingId)) {
      res.status(400).json({
        success: false,
        message: 'bookingId is required and must be a number',
      });
      return;
    }

    // Get latest tracking point
    const [latestTracking] = await connection.execute(
      'SELECT * FROM ride_tracking WHERE booking_id = ? ORDER BY recorded_at DESC LIMIT 1',
      [bookingId]
    );

    if (!Array.isArray(latestTracking) || latestTracking.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No tracking data found for this ride',
      });
      return;
    }

    const latest = (latestTracking as any[])[0];

    res.status(200).json({
      success: true,
      message: 'Latest location retrieved successfully',
      data: {
        latitude: latest.latitude,
        longitude: latest.longitude,
        status: latest.status,
        recordedAt: latest.recorded_at,
      },
    });
  } catch (error) {
    console.error('Get latest location error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving location',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};
