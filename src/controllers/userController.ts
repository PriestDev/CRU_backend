import { Request, Response } from 'express';
import pool from '../config/database';

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const userId = Number(req.params.id);

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    const [rows] = await connection.execute(
      'SELECT id, email, full_name, phone_number, campus_id FROM users WHERE id = ?',
      [userId],
    );

    const users = Array.isArray(rows) ? rows : [];
    if (users.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const user = users[0] as any;
    const name = user.full_name || null;

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        id: user.id,
        email: user.email,
        name: name || null,
        phoneNumber: user.phone_number || null,
        campusId: user.campus_id || null,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving user profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const userId = Number(req.params.id);
    const { name, email, phoneNumber, campusId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    if (!name || !email) {
      res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
      return;
    }

    await connection.execute(
      'UPDATE users SET full_name = ?, email = ?, phone_number = ?, campus_id = ? WHERE id = ?',
      [name, email, phoneNumber || null, campusId || null, userId],
    );

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating user profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};
