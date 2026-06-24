import { Request, Response } from 'express';
import pool from '../config/database';

const MAX_CARPOOL_SEATS = 5;

type CarpoolRow = {
  id: number;
  booking_id: number | null;
  trip_code: string;
  driver_name: string;
  driver_image: string;
  rating: string | number;
  total_rides: number;
  from_location: string;
  to_location: string;
  departure_time: string;
  arrival_time: string;
  price_per_seat: string | number;
  seats_total: number;
  seats_booked: number;
  vehicle_type: string;
  gender_preference: 'male' | 'female' | 'any';
  music_allowed: number | boolean;
  ac_available: number | boolean;
  status: 'open' | 'full' | 'cancelled';
};

const mapCarpoolRow = (row: CarpoolRow) => {
  const seatsTotal = Math.max(MAX_CARPOOL_SEATS, Number(row.seats_total || 0));
  const seatsBooked = Math.min(Number(row.seats_booked || 0), seatsTotal);
  const seatsLeft = Math.max(0, seatsTotal - seatsBooked);

  return {
    id: row.trip_code,
    bookingId: row.booking_id,
    driverName: row.driver_name,
    driverImage: row.driver_image,
    rating: Number(row.rating),
    totalRides: row.total_rides,
    from: row.from_location,
    to: row.to_location,
    departureTime: row.departure_time,
    arrivalTime: row.arrival_time,
    pricePerSeat: Number(row.price_per_seat),
    seatsTotal,
    seatsLeft,
    vehicleType: row.vehicle_type,
    genderPreference: row.gender_preference,
    musicAllowed: Boolean(row.music_allowed),
    acAvailable: Boolean(row.ac_available),
    status: row.status,
  };
};

export const getCarpools = async (_req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT
        c.id,
        c.booking_id,
        c.trip_code,
        c.driver_name,
        c.driver_image,
        c.rating,
        c.total_rides,
        c.from_location,
        c.to_location,
        c.departure_time,
        c.arrival_time,
        c.price_per_seat,
        c.seats_total,
        COALESCE(
          (
            SELECT SUM(cp.seats_booked)
            FROM carpool_participants cp
            WHERE cp.carpool_id = c.id
          ),
          0
        ) AS seats_booked,
        c.vehicle_type,
        c.gender_preference,
        c.music_allowed,
        c.ac_available,
        c.status
      FROM carpools c
      WHERE c.status <> 'cancelled'
        AND c.booking_id IS NOT NULL
      ORDER BY c.created_at DESC`
    );

    res.status(200).json({
      success: true,
      message: 'Carpools retrieved successfully',
      data: {
        trips: (rows as CarpoolRow[]).map(mapCarpoolRow),
      },
    });
  } catch (error) {
    console.error('Get carpools error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving carpools',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const joinCarpool = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const tripId = String(req.body.tripId || '').trim();
    const seatsRequested = Math.min(MAX_CARPOOL_SEATS, Math.max(1, Number(req.body.seatsRequested) || 1));
    const userId = req.body.userId ? Number(req.body.userId) : null;
    const passengerName = req.body.passengerName ? String(req.body.passengerName).trim() : null;

    if (!tripId) {
      res.status(400).json({
        success: false,
        message: 'tripId is required',
      });
      return;
    }

    await connection.beginTransaction();

    const [tripRows] = await connection.execute(
      `SELECT
        id,
        trip_code,
        seats_total,
        seats_booked,
        status
      FROM carpools
      WHERE trip_code = ?
      FOR UPDATE`,
      [tripId]
    );

    const trip = Array.isArray(tripRows) && tripRows.length > 0 ? (tripRows[0] as { id: number; trip_code: string; seats_total: number; seats_booked: number; status: string }) : null;

    if (!trip) {
      await connection.rollback();
      res.status(404).json({
        success: false,
        message: 'Carpool trip not found',
      });
      return;
    }

    if (trip.status === 'cancelled') {
      await connection.rollback();
      res.status(400).json({
        success: false,
        message: 'This carpool is no longer available',
      });
      return;
    }

    const normalizedSeatsTotal = Math.max(MAX_CARPOOL_SEATS, Number(trip.seats_total || 0));
    const normalizedSeatsBooked = Math.min(Number(trip.seats_booked || 0), normalizedSeatsTotal);
    const seatsLeft = normalizedSeatsTotal - normalizedSeatsBooked;

    if (seatsLeft <= 0) {
      await connection.rollback();
      res.status(400).json({
        success: false,
        message: 'This carpool is already full',
      });
      return;
    }

    if (seatsRequested > seatsLeft) {
      await connection.rollback();
      res.status(400).json({
        success: false,
        message: 'Not enough seats left in this carpool',
      });
      return;
    }

    if (normalizedSeatsTotal !== Number(trip.seats_total || 0)) {
      await connection.execute(
        `UPDATE carpools
         SET seats_total = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [normalizedSeatsTotal, trip.id]
      );
    }

    const updatedSeatsBooked = normalizedSeatsBooked + seatsRequested;
    const updatedStatus = updatedSeatsBooked >= normalizedSeatsTotal ? 'full' : 'open';

    await connection.execute(
      `UPDATE carpools
       SET seats_booked = ?, status = ?
       WHERE id = ?`,
      [updatedSeatsBooked, updatedStatus, trip.id]
    );

    const [existingParticipantRows] = await connection.execute(
      `SELECT id
       FROM carpool_participants
       WHERE carpool_id = ? AND user_id = ?
       LIMIT 1`,
      [trip.id, userId]
    );

    if (Array.isArray(existingParticipantRows) && existingParticipantRows.length > 0) {
      await connection.rollback();
      res.status(409).json({
        success: false,
        message: 'You have already joined this carpool.',
      });
      return;
    }

    const participantResult = await connection.execute(
      `INSERT INTO carpool_participants (
        carpool_id,
        user_id,
        passenger_name,
        seats_booked
      ) VALUES (?, ?, ?, ?)` ,
      [trip.id, userId, passengerName, seatsRequested]
    );

    const meta = Array.isArray(participantResult) ? participantResult[0] : participantResult;
    const participantId = (meta as any).insertId;

    const [recomputedRows] = await connection.execute(
      `SELECT COALESCE(SUM(seats_booked), 0) AS total_booked
       FROM carpool_participants
       WHERE carpool_id = ?`,
      [trip.id]
    );
    const totalBooked = Math.max(0, Number((recomputedRows as any[])[0]?.total_booked || 0));
    const finalSeatsBooked = Math.min(normalizedSeatsTotal, totalBooked);
    const finalStatus = finalSeatsBooked >= normalizedSeatsTotal ? 'full' : 'open';

    await connection.execute(
      `UPDATE carpools
       SET seats_booked = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [finalSeatsBooked, finalStatus, trip.id]
    );

    await connection.commit();

    const updatedTrip = {
      id: trip.trip_code,
      seatsTotal: normalizedSeatsTotal,
      seatsLeft: Math.max(0, normalizedSeatsTotal - finalSeatsBooked),
      status: finalStatus,
    };

    res.status(200).json({
      success: true,
      message: 'Joined carpool successfully',
      data: {
        participantId,
        trip: updatedTrip,
      },
    });
  } catch (error) {
    try {
      await connection.rollback();
    } catch {
      // Ignore rollback errors
    }

    console.error('Join carpool error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while joining the carpool',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};
