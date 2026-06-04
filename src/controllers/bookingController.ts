import { Request, Response } from 'express';
import pool from '../config/database';

const validBookingTypes = ['oneWay', 'roundTrip', 'multiStop', 'schedule'];
const validRideOptions = ['standard', 'carpool'];

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const {
      userId,
      bookingType,
      rideOption,
      passengers,
      fromLocation,
      toLocation,
      stops,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      note,
      estimatedPrice,
    } = req.body;

    if (!userId || !fromLocation || !toLocation || !bookingType) {
      res.status(400).json({
        success: false,
        message: 'userId, bookingType, fromLocation and toLocation are required',
      });
      return;
    }

    if (!validBookingTypes.includes(bookingType)) {
      res.status(400).json({
        success: false,
        message: `Invalid bookingType. Valid values are: ${validBookingTypes.join(', ')}`,
      });
      return;
    }

    if (rideOption && !validRideOptions.includes(rideOption)) {
      res.status(400).json({
        success: false,
        message: `Invalid rideOption. Valid values are: ${validRideOptions.join(', ')}`,
      });
      return;
    }

    const passengersCount = Number(passengers) || 1;
    const stopsValue = stops ? JSON.stringify(stops) : null;
    const bookingResult = await connection.execute(
      `INSERT INTO bookings (
        user_id,
        booking_type,
        ride_option,
        passengers,
        from_location,
        to_location,
        stops,
        pickup_date,
        pickup_time,
        return_date,
        return_time,
        note,
        estimated_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        bookingType,
        rideOption || 'standard',
        passengersCount,
        fromLocation,
        toLocation,
        stopsValue,
        pickupDate || null,
        pickupTime || null,
        returnDate || null,
        returnTime || null,
        note || null,
        Number(estimatedPrice) || 0,
      ]
    );

    const meta = Array.isArray(bookingResult) ? bookingResult[0] : bookingResult;
    const insertId = (meta as any).insertId;

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId: insertId,
      },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the booking',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const getBookings = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const userId = req.query.userId ? Number(req.query.userId) : null;
    const query = userId
      ? 'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC'
      : 'SELECT * FROM bookings ORDER BY created_at DESC';
    const params = userId ? [userId] : [];
    const [rows] = await connection.execute(query, params);

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: {
        bookings: rows,
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving bookings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};
