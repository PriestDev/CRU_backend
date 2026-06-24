import { Request, Response } from 'express';
import pool from '../config/database';
import { validateAbujaCampusRoute } from '../utils/area';

const validDeliveryTypes = ['food', 'docs', 'other'] as const;
type DeliveryType = (typeof validDeliveryTypes)[number];

type DeliveryRow = {
  id: number;
  user_id: number | null;
  delivery_type: DeliveryType;
  pickup_location: string;
  dropoff_location: string;
  note: string | null;
  estimated_fee: string | number;
  estimated_minutes: number;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  created_at: string;
};

const calculateEstimatedFee = (deliveryType: DeliveryType) => {
  if (deliveryType === 'food') return 1200;
  if (deliveryType === 'docs') return 800;
  return 1500;
};

const calculateEstimatedMinutes = (deliveryType: DeliveryType) => {
  if (deliveryType === 'food') return 25;
  if (deliveryType === 'docs') return 20;
  return 30;
};

export const createDelivery = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const {
      userId,
      deliveryType,
      pickupLocation,
      dropoffLocation,
      note,
      estimatedFee,
      estimatedMinutes,
    } = req.body;

    const normalizedType = validDeliveryTypes.includes(deliveryType) ? (deliveryType as DeliveryType) : 'other';

    if (!pickupLocation || !dropoffLocation) {
      res.status(400).json({
        success: false,
        message: 'pickupLocation and dropoffLocation are required',
      });
      return;
    }

    if (!validateAbujaCampusRoute([pickupLocation, dropoffLocation])) {
      res.status(400).json({
        success: false,
        message:
          'Delivery routes must be within Abuja Campus only. Please use pickup and dropoff locations that reference Abuja Campus.',
      });
      return;
    }

    const fee = Number(estimatedFee) || calculateEstimatedFee(normalizedType);
    const minutes = Number(estimatedMinutes) || calculateEstimatedMinutes(normalizedType);
    const normalizedUserId = userId ? Number(userId) : null;

    const result = await connection.execute(
      `INSERT INTO deliveries (
        user_id,
        delivery_type,
        pickup_location,
        dropoff_location,
        note,
        estimated_fee,
        estimated_minutes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        normalizedUserId,
        normalizedType,
        pickupLocation,
        dropoffLocation,
        note || null,
        fee,
        minutes,
      ]
    );

    const meta = Array.isArray(result) ? result[0] : result;
    const insertId = (meta as any).insertId;

    res.status(201).json({
      success: true,
      message: 'Delivery created successfully',
      data: {
        deliveryId: insertId,
        estimatedFee: fee,
        estimatedMinutes: minutes,
      },
    });
  } catch (error) {
    console.error('Create delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the delivery',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const getDeliveries = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const userId = req.query.userId ? Number(req.query.userId) : null;
    const query = userId
      ? 'SELECT * FROM deliveries WHERE user_id = ? ORDER BY created_at DESC'
      : 'SELECT * FROM deliveries ORDER BY created_at DESC';
    const params = userId ? [userId] : [];
    const [rows] = await connection.execute(query, params);

    const deliveries = (rows as DeliveryRow[]).map((delivery) => ({
      id: delivery.id,
      userId: delivery.user_id,
      deliveryType: delivery.delivery_type,
      pickupLocation: delivery.pickup_location,
      dropoffLocation: delivery.dropoff_location,
      note: delivery.note,
      estimatedFee: Number(delivery.estimated_fee),
      estimatedMinutes: delivery.estimated_minutes,
      status: delivery.status,
      createdAt: delivery.created_at,
    }));

    res.status(200).json({
      success: true,
      message: 'Deliveries retrieved successfully',
      data: {
        deliveries,
      },
    });
  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving deliveries',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const updateDeliveryStatus = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      res.status(400).json({
        success: false,
        message: 'Delivery ID and status are required',
      });
      return;
    }

    const validStatuses = ['pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
      return;
    }

    // Check if delivery exists
    const [deliveries] = await connection.execute(
      'SELECT id FROM deliveries WHERE id = ?',
      [id]
    );

    if (!Array.isArray(deliveries) || deliveries.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
      return;
    }

    // Update delivery status
    await connection.execute(
      'UPDATE deliveries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    res.status(200).json({
      success: true,
      message: 'Delivery status updated successfully',
      data: {
        deliveryId: id,
        status,
      },
    });
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating delivery status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};
