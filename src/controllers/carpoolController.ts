import { Request, Response } from 'express';
import pool from '../config/database';

type CarpoolRow = {
  id: number;
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

const mapCarpoolRow = (row: CarpoolRow) => ({
  id: row.trip_code,
  driverName: row.driver_name,
  driverImage: row.driver_image,
  rating: Number(row.rating),
  totalRides: row.total_rides,
  from: row.from_location,
  to: row.to_location,
  departureTime: row.departure_time,
  arrivalTime: row.arrival_time,
  pricePerSeat: Number(row.price_per_seat),
  seatsLeft: Math.max(0, row.seats_total - row.seats_booked),
  vehicleType: row.vehicle_type,
  genderPreference: row.gender_preference,
  musicAllowed: Boolean(row.music_allowed),
  acAvailable: Boolean(row.ac_available),
  status: row.status,
});

export const getCarpools = async (_req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT
        id,
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
      FROM carpools
      WHERE status <> 'cancelled'
      ORDER BY created_at DESC`
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
    const seatsRequested = Math.min(4, Math.max(1, Number(req.body.seatsRequested) || 1));
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

    const seatsLeft = trip.seats_total - trip.seats_booked;
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

    const updatedSeatsBooked = trip.seats_booked + seatsRequested;
    const updatedStatus = updatedSeatsBooked >= trip.seats_total ? 'full' : 'open';

    await connection.execute(
      `UPDATE carpools
       SET seats_booked = ?, status = ?
       WHERE id = ?`,
      [updatedSeatsBooked, updatedStatus, trip.id]
    );

    const participantResult = await connection.execute(
      `INSERT INTO carpool_participants (
        carpool_id,
        user_id,
        passenger_name,
        seats_booked
      ) VALUES (?, ?, ?, ?)`,
      [trip.id, userId, passengerName, seatsRequested]
    );

    await connection.commit();

    const meta = Array.isArray(participantResult) ? participantResult[0] : participantResult;
    const participantId = (meta as any).insertId;

    const updatedTrip = {
      id: trip.trip_code,
      seatsLeft: Math.max(0, trip.seats_total - updatedSeatsBooked),
      status: updatedStatus,
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
