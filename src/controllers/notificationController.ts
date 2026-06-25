import { Request, Response } from 'express';
import pool from '../config/database';

type NotificationRow = {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'ride' | 'delivery' | 'promo' | 'system';
  is_read: number | boolean;
  created_at: string;
  updated_at: string;
};

const getUserIdFromRequest = (req: Request): number | null => {
  const queryUserId = toUserId(req.query.userId);
  const authUserId = toUserId((req as any).userId);

  return queryUserId || authUserId;
};

const toUserId = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return null;
};

const formatTime = (createdAt: string) => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffMinutes < 1) return 'Now';
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h`;
  if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)}d`;
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
};

const mapNotification = (notification: NotificationRow) => ({
  id: notification.id,
  title: notification.title,
  message: notification.message,
  type: notification.type,
  isRead: Boolean(notification.is_read),
  time: formatTime(notification.created_at),
  createdAt: notification.created_at,
});

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      res.status(401).json({ success: false, message: 'User authentication required' });
      return;
    }

    const [rows] = await connection.execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    const notifications = (rows as NotificationRow[]).map(mapNotification);

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: {
        notifications,
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving notifications',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const userId = getUserIdFromRequest(req);
    const notificationId = Number(req.params.id);

    if (!userId) {
      res.status(401).json({ success: false, message: 'User authentication required' });
      return;
    }

    if (!notificationId) {
      res.status(400).json({ success: false, message: 'Notification ID is required' });
      return;
    }

    const [result] = await connection.execute(
      'UPDATE notifications SET is_read = true, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );

    const affectedRows = (result as any).affectedRows;

    if (!affectedRows) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the notification',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      res.status(401).json({ success: false, message: 'User authentication required' });
      return;
    }

    await connection.execute(
      'UPDATE notifications SET is_read = true, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [userId]
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating notifications',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};
