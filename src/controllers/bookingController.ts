import { Request, Response } from 'express';
import pool from '../config/database';
import { validateAbujaCampusRoute } from '../utils/area';

const sendRideStartNotification = async (
  connection: any,
  bookingId: number,
  riderId: number,
  message: string,
) => {
  const [bookingRows] = await connection.execute(
    'SELECT user_id FROM bookings WHERE id = ?',
    [bookingId],
  );
  const booking = Array.isArray(bookingRows) && bookingRows.length > 0 ? bookingRows[0] as any : null;
  const passengerUserId = booking?.user_id;

  if (!passengerUserId || passengerUserId === riderId) return;

  await connection.execute(
    `INSERT INTO notifications (user_id, title, message, type, is_read)
     VALUES (?, ?, ?, 'ride', false)`,
    [passengerUserId, 'Ride start request', message,],
  );
};

const validBookingTypes = ['oneWay', 'roundTrip', 'multiStop', 'schedule'];
const validRideOptions = ['standard', 'carpool'];
const MAX_CARPOOL_SEATS = 5;

const addMinutes = (time: string, minutes: number) => {
  const [hours, mins] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours || 0, mins || 0, 0, 0);
  date.setMinutes(date.getMinutes() + minutes);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const getTimeValue = (time?: string | null) => {
  if (time && /^\d{2}:\d{2}$/.test(time)) {
    return time;
  }

  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const getDriverDetails = async (connection: any, userId: number) => {
  const [userRows] = await connection.execute(
    `SELECT full_name, profile_picture_url FROM users WHERE id = ? LIMIT 1`,
    [userId]
  );

  const userRow = Array.isArray(userRows) && userRows.length > 0 ? userRows[0] : null;

  return {
    driverName: userRow?.full_name || 'Campus Driver',
    driverImage: userRow?.profile_picture_url || 'https://placehold.net/avatar-4.svg',
  };
};

const syncCarpoolForBooking = async (
  connection: any,
  booking: {
    bookingId: number;
    userId: number;
    passengers: number;
    fromLocation: string;
    toLocation: string;
    pickupDate: string | null;
    pickupTime: string | null;
    estimatedPrice: number;
    bookingType: string;
  }
) => {
  const passengersCount = Math.max(1, Number(booking.passengers) || 1);
  const creatorSeatCount = 1;
  const pricePerSeat = Number(booking.estimatedPrice) > 0
    ? Number(booking.estimatedPrice) / Math.max(1, passengersCount)
    : 0;
  const departureTime = getTimeValue(booking.pickupTime);
  const arrivalTime = addMinutes(departureTime, 30);
  const isScheduled = Boolean(booking.pickupDate || booking.pickupTime);

  const routeFrom = booking.fromLocation.trim();
  const routeTo = booking.toLocation.trim();
  const normalizedFrom = routeFrom.toLowerCase();
  const normalizedTo = routeTo.toLowerCase();
  const maxSeats = MAX_CARPOOL_SEATS;

  const { driverName, driverImage } = await getDriverDetails(connection, booking.userId);
  const tripCode = `CP-${String(booking.bookingId).padStart(3, '0')}`;

  const [existingRows] = await connection.execute(
    `SELECT
      c.id,
      c.trip_code,
      c.seats_total,
      c.seats_booked,
      c.status,
      c.departure_time,
      c.arrival_time,
      c.price_per_seat,
      c.from_location,
      c.to_location,
      COALESCE(
        (
          SELECT SUM(cp.seats_booked)
          FROM carpool_participants cp
          WHERE cp.carpool_id = c.id
        ),
        0
      ) AS actual_booked
    FROM carpools c
    WHERE c.status <> 'cancelled'
      AND LOWER(c.from_location) = ?
      AND LOWER(c.to_location) = ?
      AND ABS(c.price_per_seat - ?) < 0.01
      AND c.departure_time = ?
      AND c.arrival_time = ?
    ORDER BY c.created_at DESC
    LIMIT 1`,
    [normalizedFrom, normalizedTo, pricePerSeat, departureTime, arrivalTime]
  );

  const matchingCarpool = Array.isArray(existingRows) && existingRows.length > 0 ? existingRows[0] : null;

  if (matchingCarpool) {
    const normalizedSeatsTotal = Math.max(
      MAX_CARPOOL_SEATS,
      Number(matchingCarpool.seats_total) || 0
    );
    const actualBooked = Math.max(0, Number(matchingCarpool.actual_booked || 0));

    if (Number(matchingCarpool.seats_total) !== normalizedSeatsTotal) {
      await connection.execute(
        `UPDATE carpools
         SET seats_total = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [normalizedSeatsTotal, matchingCarpool.id]
      );
    }

    const remainingSeats = Math.max(0, normalizedSeatsTotal - actualBooked);
    const seatsToUse = Math.min(creatorSeatCount, remainingSeats);

    if (seatsToUse > 0) {
      const [existingParticipantRows] = await connection.execute(
        `SELECT id, seats_booked
         FROM carpool_participants
         WHERE carpool_id = ? AND user_id = ?
         LIMIT 1`,
        [matchingCarpool.id, booking.userId]
      );

      if (Array.isArray(existingParticipantRows) && existingParticipantRows.length > 0) {
        const existingParticipant = existingParticipantRows[0] as { id: number; seats_booked: number };
        const updatedParticipantSeats = Number(existingParticipant.seats_booked || 0) + seatsToUse;

        await connection.execute(
          `UPDATE carpool_participants
           SET seats_booked = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [updatedParticipantSeats, existingParticipant.id]
        );
      } else {
        await connection.execute(
          `INSERT INTO carpool_participants (carpool_id, user_id, passenger_name, seats_booked)
           VALUES (?, ?, ?, ?)` ,
          [matchingCarpool.id, booking.userId, driverName, seatsToUse]
        );
      }

      const [participantRows] = await connection.execute(
        `SELECT COALESCE(SUM(seats_booked), 0) AS total_booked
         FROM carpool_participants
         WHERE carpool_id = ?`,
        [matchingCarpool.id]
      );
      const updatedSeatsBooked = Math.min(
        normalizedSeatsTotal,
        Math.max(0, Number((participantRows as any[])[0]?.total_booked || 0))
      );
      const updatedStatus = updatedSeatsBooked >= normalizedSeatsTotal ? 'full' : 'open';

      await connection.execute(
        `UPDATE carpools
         SET seats_booked = ?, status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [updatedSeatsBooked, updatedStatus, matchingCarpool.id]
      );
    }

    return;
  }

  const seatsTotal = maxSeats;
  const seatsBooked = Math.min(creatorSeatCount, seatsTotal);
  const status = seatsBooked >= seatsTotal ? 'full' : 'open';

  await connection.execute(
    `INSERT INTO carpools (
      trip_code,
      booking_id,
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
    [
      tripCode,
      booking.bookingId,
      driverName,
      driverImage,
      0,
      0,
      routeFrom,
      routeTo,
      departureTime,
      arrivalTime,
      pricePerSeat.toFixed(2),
      seatsTotal,
      seatsBooked,
      isScheduled ? 'Shared Ride' : 'Shared Ride',
      'any',
      true,
      false,
      status,
    ]
  );

  await connection.execute(
    `INSERT INTO carpool_participants (carpool_id, user_id, passenger_name, seats_booked)
     VALUES ((SELECT id FROM carpools WHERE trip_code = ? LIMIT 1), ?, ?, ?)`,
    [tripCode, booking.userId, driverName, seatsBooked]
  );
};

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

    const routeLocations: string[] = [
      fromLocation,
      toLocation,
      ...(Array.isArray(stops)
        ? stops.map((stop) =>
            typeof stop === 'string' ? stop : (stop?.value ? String(stop.value) : ''),
          )
        : []),
    ].filter(Boolean);

    if (!validateAbujaCampusRoute(routeLocations)) {
      res.status(400).json({
        success: false,
        message:
          'Booking routes must be within Abuja Campus only. Please use pickup, dropoff, and stop locations that reference Abuja Campus.',
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

    await connection.beginTransaction();

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

    if (rideOption === 'carpool') {
      await syncCarpoolForBooking(connection, {
        bookingId: insertId,
        userId,
        passengers: passengersCount,
        fromLocation,
        toLocation,
        pickupDate: pickupDate || null,
        pickupTime: pickupTime || null,
        estimatedPrice: Number(estimatedPrice) || 0,
        bookingType,
      });
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId: insertId,
      },
    });
  } catch (error) {
    try {
      await connection.rollback();
    } catch {
      // ignore rollback failure
    }

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

export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const bookingId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isFinite(bookingId)) {
      res.status(400).json({
        success: false,
        message: 'A valid booking ID is required',
      });
      return;
    }

    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Valid values are: ${validStatuses.join(', ')}`,
      });
      return;
    }

    const [bookingRows] = await connection.execute(
      'SELECT user_id, status, start_request_status FROM bookings WHERE id = ?',
      [bookingId],
    );
    const booking = Array.isArray(bookingRows) && bookingRows.length > 0 ? bookingRows[0] as any : null;

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    if (status === 'in_progress') {
      await connection.execute(
        `UPDATE bookings
         SET status = 'in_progress', start_request_status = 'requested', started_at = NULL
         WHERE id = ?`,
        [bookingId],
      );

      await sendRideStartNotification(
        connection,
        bookingId,
        Number(booking.user_id),
        'The rider has requested to start your trip. Please approve to begin the ride.',
      );

      res.status(200).json({
        success: true,
        message: 'Ride start request sent to passengers.',
        data: {
          bookingId,
          status: 'in_progress',
        },
      });
      return;
    }

    let updateQuery = 'UPDATE bookings SET status = ?';
    const updateValues: any[] = [status];

    if (status === 'completed') {
      updateQuery += ', start_request_status = CASE WHEN start_request_status = "requested" THEN "approved" ELSE start_request_status END, started_at = COALESCE(started_at, CURRENT_TIMESTAMP)';
    } else if (status === 'cancelled') {
      updateQuery += ', start_request_status = "rejected"';
    }

    updateQuery += ' WHERE id = ?';
    updateValues.push(bookingId);

    const [result] = await connection.execute(updateQuery, updateValues);
    const meta = Array.isArray(result) ? result[0] : result;
    const affectedRows = Number((meta as any).affectedRows || 0);

    if (affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    if (status === 'confirmed') {
      await connection.execute(
        `UPDATE carpools
         SET status = 'open', updated_at = CURRENT_TIMESTAMP
         WHERE booking_id = ?`,
        [bookingId]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: {
        bookingId,
        status,
      },
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating booking status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const updateRideStartApproval = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const bookingId = Number(req.params.id);
    const { userId, approved } = req.body;

    if (!Number.isFinite(bookingId)) {
      res.status(400).json({
        success: false,
        message: 'A valid booking ID is required',
      });
      return;
    }

    if (!Number.isFinite(Number(userId))) {
      res.status(400).json({
        success: false,
        message: 'A valid user ID is required',
      });
      return;
    }

    const [bookingRows] = await connection.execute(
      'SELECT user_id, status, start_request_status FROM bookings WHERE id = ?',
      [bookingId],
    );
    const booking = Array.isArray(bookingRows) && bookingRows.length > 0 ? bookingRows[0] as any : null;

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    if (Number(userId) !== Number(booking.user_id)) {
      res.status(403).json({
        success: false,
        message: 'Only the passenger can approve this ride start request',
      });
      return;
    }

    if (booking.status !== 'in_progress' || booking.start_request_status !== 'requested') {
      res.status(400).json({
        success: false,
        message: 'No pending ride start approval found for this booking',
      });
      return;
    }

    const approvalStatus = approved ? 'approved' : 'rejected';

    await connection.execute(
      `INSERT INTO ride_start_approvals (booking_id, user_id, status)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status), updated_at = CURRENT_TIMESTAMP`,
      [bookingId, Number(userId), approvalStatus],
    );

    if (approved) {
      await connection.execute(
        `UPDATE bookings
         SET status = 'in_progress', start_request_status = 'approved', started_at = COALESCE(started_at, CURRENT_TIMESTAMP)
         WHERE id = ?`,
        [bookingId],
      );
    } else {
      await connection.execute(
        `UPDATE bookings
         SET start_request_status = 'rejected'
         WHERE id = ?`,
        [bookingId],
      );
    }

    res.status(200).json({
      success: true,
      message: approved
        ? 'Ride start approved successfully.'
        : 'Ride start request rejected.',
      data: {
        bookingId,
        approved,
      },
    });
  } catch (error) {
    console.error('Update ride start approval error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating ride start approval',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};
