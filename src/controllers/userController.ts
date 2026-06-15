import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
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
    const { name, email, phoneNumber, campusId, newPassword, confirmNewPassword } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    const [existingRows] = await connection.execute(
      'SELECT id, full_name, email, phone_number, campus_id FROM users WHERE id = ?',
      [userId],
    );

    const existingUsers = Array.isArray(existingRows) ? existingRows : [];
    if (existingUsers.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const existingUser = existingUsers[0] as any;
    const nextName = typeof name === 'string' && name.trim() ? name.trim() : existingUser.full_name;
    const nextEmail = typeof email === 'string' && email.trim() ? email.trim() : existingUser.email;
    const nextPhoneNumber = typeof phoneNumber === 'string' && phoneNumber.trim() ? phoneNumber.trim() : existingUser.phone_number;
    const nextCampusId = typeof campusId === 'string' && campusId.trim() ? campusId.trim() : existingUser.campus_id;

    if (!nextName || !nextEmail) {
      res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
      return;
    }

    let passwordHash: string | null = null;

    const hasPassword = typeof newPassword === 'string' && newPassword.trim().length > 0;
    if (hasPassword) {
      if (newPassword !== confirmNewPassword) {
        res.status(400).json({
          success: false,
          message: 'New password and confirmation do not match',
        });
        return;
      }

      if (newPassword.trim().length < 6) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters',
        });
        return;
      }

      passwordHash = await bcryptjs.hash(newPassword, 10);
    }

    const updateQuery = passwordHash
      ? 'UPDATE users SET full_name = ?, email = ?, phone_number = ?, campus_id = ?, password_hash = ? WHERE id = ?'
      : 'UPDATE users SET full_name = ?, email = ?, phone_number = ?, campus_id = ? WHERE id = ?';

    const updateParams = passwordHash
      ? [nextName, nextEmail, nextPhoneNumber, nextCampusId, passwordHash, userId]
      : [nextName, nextEmail, nextPhoneNumber, nextCampusId, userId];

    await connection.execute(updateQuery, updateParams);

    res.status(200).json({
      success: true,
      message: passwordHash
        ? 'Profile and password updated successfully'
        : 'User profile updated successfully',
      data: {
        id: userId,
        name: nextName,
        email: nextEmail,
        phoneNumber: nextPhoneNumber,
        campusId: nextCampusId,
      },
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
