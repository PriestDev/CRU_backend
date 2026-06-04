import { Request, Response } from 'express';
import pool from '../config/database';

const validRelationships = ['Parent', 'Friend', 'Guardian'];

export const createEmergencyContact = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const { userId, fullName, phoneNumber, relationship, notes } = req.body;

    if (!userId || !fullName || !phoneNumber || !relationship) {
      res.status(400).json({
        success: false,
        message: 'userId, fullName, phoneNumber and relationship are required',
      });
      return;
    }

    if (!validRelationships.includes(relationship)) {
      res.status(400).json({
        success: false,
        message: `Invalid relationship. Valid values are: ${validRelationships.join(', ')}`,
      });
      return;
    }

    const result = await connection.execute(
      'INSERT INTO emergency_contacts (user_id, full_name, phone_number, relationship, notes) VALUES (?, ?, ?, ?, ?)',
      [userId, fullName, phoneNumber, relationship, notes || null]
    );

    const meta = Array.isArray(result) ? result[0] : result;
    const insertId = (meta as any).insertId;

    res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: {
        contactId: insertId,
      },
    });
  } catch (error) {
    console.error('Create emergency contact error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the emergency contact',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const getEmergencyContacts = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const userId = req.query.userId ? Number(req.query.userId) : null;
    const query = userId
      ? 'SELECT * FROM emergency_contacts WHERE user_id = ? ORDER BY created_at DESC'
      : 'SELECT * FROM emergency_contacts ORDER BY created_at DESC';
    const params = userId ? [userId] : [];
    const [rows] = await connection.execute(query, params);

    res.status(200).json({
      success: true,
      message: 'Emergency contacts retrieved successfully',
      data: {
        contacts: rows,
      },
    });
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving emergency contacts',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const deleteEmergencyContact = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const id = Number(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Contact ID is required',
      });
      return;
    }

    const [result] = await connection.execute('DELETE FROM emergency_contacts WHERE id = ?', [id]);
    const affectedRows = (result as any).affectedRows;

    if (!affectedRows) {
      res.status(404).json({
        success: false,
        message: 'Emergency contact not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Emergency contact deleted successfully',
    });
  } catch (error) {
    console.error('Delete emergency contact error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the emergency contact',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};
