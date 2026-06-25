import { Request, Response } from 'express';
import pool from '../config/database';

const readNumberQueryParam = (value: unknown): number | null => {
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  return null;
};

// Create or update ride rating
export const createRating = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const { bookingId, userId, rating, comment } = req.body;

    // Validate input
    if (!bookingId || !userId || !rating) {
      res.status(400).json({
        success: false,
        message: 'bookingId, userId, and rating are required',
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
      return;
    }

    // Check if booking exists
    const [bookings] = await connection.execute(
      'SELECT id FROM bookings WHERE id = ?',
      [bookingId]
    );

    if (!Array.isArray(bookings) || bookings.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    // Check if rating already exists
    const [existingRatings] = await connection.execute(
      'SELECT id FROM ride_ratings WHERE booking_id = ? AND user_id = ?',
      [bookingId, userId]
    );

    if (Array.isArray(existingRatings) && existingRatings.length > 0) {
      // Update existing rating
      await connection.execute(
        'UPDATE ride_ratings SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP WHERE booking_id = ? AND user_id = ?',
        [rating, comment || null, bookingId, userId]
      );
    } else {
      // Create new rating
      await connection.execute(
        'INSERT INTO ride_ratings (booking_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [bookingId, userId, rating, comment || null]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Rating saved successfully',
      data: {
        bookingId,
        userId,
        rating,
        comment,
      },
    });
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while saving rating',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

// Get rating for a specific booking
export const getRatingByBooking = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const bookingId = readNumberQueryParam(req.query.bookingId);

    if (bookingId === null) {
      res.status(400).json({
        success: false,
        message: 'bookingId is required',
      });
      return;
    }

    const [ratings] = await connection.execute(
      'SELECT * FROM ride_ratings WHERE booking_id = ?',
      [bookingId]
    );

    res.status(200).json({
      success: true,
      message: 'Rating retrieved successfully',
      data: {
        ratings: ratings || [],
      },
    });
  } catch (error) {
    console.error('Get rating error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving rating',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

// Get all ratings for a user (as a driver or passenger)
export const getRatingsByUser = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const userId = readNumberQueryParam(req.query.userId);

    if (userId === null) {
      res.status(400).json({
        success: false,
        message: 'userId is required',
      });
      return;
    }

    const [ratings] = await connection.execute(
      'SELECT * FROM ride_ratings WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    // Calculate average rating
    let averageRating = 0;
    if (Array.isArray(ratings) && ratings.length > 0) {
      const sum = (ratings as any[]).reduce((acc, r) => acc + r.rating, 0);
      averageRating = sum / ratings.length;
    }

    res.status(200).json({
      success: true,
      message: 'User ratings retrieved successfully',
      data: {
        ratings: ratings || [],
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalRatings: Array.isArray(ratings) ? ratings.length : 0,
      },
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving ratings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};
