import { Request, Response } from 'express';
import pool from '../config/database';

type WalletAccountRow = {
  id: number;
  wallet_code: string;
  user_id: number | null;
  balance: string | number;
  currency: string;
  status: 'active' | 'frozen' | 'closed';
  created_at: string;
  updated_at: string;
};

type WalletTransactionRow = {
  id: number;
  wallet_account_id: number;
  user_id: number | null;
  transaction_type: 'fund' | 'withdraw' | 'payment' | 'refund';
  amount: string | number;
  balance_before: string | number;
  balance_after: string | number;
  reference: string;
  description: string | null;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
};

const toUserId = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return null;
};

const getUserIdFromRequest = (req: Request): number | null => {
  const queryUserId = toUserId(req.query.userId);
  const bodyUserId = toUserId(req.body?.userId);
  const authUserId = toUserId((req as any).userId);

  if (queryUserId) return queryUserId;
  if (bodyUserId) return bodyUserId;
  if (authUserId) return authUserId;

  return null;
};

const getOrCreateWallet = async (connection: any, userId: number) => {
  const [rows] = await connection.execute(
    `SELECT * FROM wallet_accounts WHERE user_id = ? ORDER BY created_at ASC LIMIT 1`,
    [userId]
  );

  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0] as WalletAccountRow;
  }

  const walletCode = `WAL-${userId}-${Date.now()}`;
  const result = await connection.execute(
    `INSERT INTO wallet_accounts (wallet_code, user_id, balance, currency, status) VALUES (?, ?, 0.00, 'NGN', 'active')`,
    [walletCode, userId]
  );

  const meta = Array.isArray(result) ? result[0] : result;
  const insertId = (meta as any).insertId;

  return {
    id: insertId,
    wallet_code: walletCode,
    user_id: userId,
    balance: 0,
    currency: 'NGN',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as WalletAccountRow;
};

const createReference = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const mapTransaction = (transaction: WalletTransactionRow) => ({
  id: transaction.id,
  type: transaction.transaction_type,
  title:
    transaction.transaction_type === 'fund'
      ? `Wallet Top-up • ${transaction.reference}`
      : transaction.transaction_type === 'withdraw'
      ? `Wallet Withdrawal • ${transaction.reference}`
      : transaction.transaction_type === 'refund'
      ? `Wallet Refund • ${transaction.reference}`
      : `Wallet Payment • ${transaction.reference}`,
  date: new Date(transaction.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
  time: new Date(transaction.created_at).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' }),
  amount: `${transaction.transaction_type === 'fund' || transaction.transaction_type === 'refund' ? '+' : '-'}₦${Number(transaction.amount).toFixed(2)}`,
  status: transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'processing' : 'failed',
  reference: transaction.reference,
  description: transaction.description,
});

export const getWallet = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      res.status(401).json({ success: false, message: 'User authentication required' });
      return;
    }

    const wallet = await getOrCreateWallet(connection, userId);

    const [transactionRows] = await connection.execute(
      `SELECT * FROM wallet_transactions WHERE wallet_account_id = ? ORDER BY created_at DESC LIMIT 20`,
      [wallet.id]
    );

    res.status(200).json({
      success: true,
      message: 'Wallet retrieved successfully',
      data: {
        wallet: {
          id: wallet.id,
          walletCode: wallet.wallet_code,
          userId: wallet.user_id,
          balance: Number(wallet.balance),
          currency: wallet.currency,
          status: wallet.status,
          createdAt: wallet.created_at,
        },
        transactions: (transactionRows as WalletTransactionRow[]).map(mapTransaction),
      },
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving wallet details',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const fundWallet = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      res.status(401).json({ success: false, message: 'User authentication required' });
      return;
    }

    const amount = Number(req.body.amount);
    const description = req.body.description ? String(req.body.description).trim() : 'Wallet top-up';

    if (!Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({ success: false, message: 'Amount must be greater than zero' });
      return;
    }

    await connection.beginTransaction();

    const wallet = await getOrCreateWallet(connection, userId);
    const balanceBefore = Number(wallet.balance);
    const balanceAfter = balanceBefore + amount;
    const reference = createReference('TOP');

    await connection.execute(
      `UPDATE wallet_accounts SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [balanceAfter, wallet.id]
    );

    const transactionResult = await connection.execute(
      `INSERT INTO wallet_transactions (
        wallet_account_id,
        user_id,
        transaction_type,
        amount,
        balance_before,
        balance_after,
        reference,
        description,
        status,
        metadata
      ) VALUES (?, ?, 'fund', ?, ?, ?, ?, ?, 'completed', ?)` ,
      [wallet.id, userId, amount, balanceBefore, balanceAfter, reference, description, JSON.stringify({ source: 'wallet_fund' })]
    );

    await connection.commit();

    const meta = Array.isArray(transactionResult) ? transactionResult[0] : transactionResult;
    const transactionId = (meta as any).insertId;

    res.status(201).json({
      success: true,
      message: 'Wallet funded successfully',
      data: {
        wallet: {
          id: wallet.id,
          balance: balanceAfter,
          currency: wallet.currency,
        },
        transactionId,
        reference,
      },
    });
  } catch (error) {
    try {
      await connection.rollback();
    } catch {
      // ignore rollback errors
    }

    console.error('Fund wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while funding the wallet',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const withdrawWallet = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      res.status(401).json({ success: false, message: 'User authentication required' });
      return;
    }

    const amount = Number(req.body.amount);
    const bankName = req.body.bankName ? String(req.body.bankName).trim() : '';
    const accountNumber = req.body.accountNumber ? String(req.body.accountNumber).trim() : '';

    if (!Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({ success: false, message: 'Amount must be greater than zero' });
      return;
    }

    if (!bankName || !accountNumber) {
      res.status(400).json({ success: false, message: 'bankName and accountNumber are required' });
      return;
    }

    await connection.beginTransaction();

    const wallet = await getOrCreateWallet(connection, userId);
    const balanceBefore = Number(wallet.balance);

    if (balanceBefore < amount) {
      await connection.rollback();
      res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
      return;
    }

    const balanceAfter = balanceBefore - amount;
    const reference = createReference('WTH');

    await connection.execute(
      `UPDATE wallet_accounts SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [balanceAfter, wallet.id]
    );

    const transactionResult = await connection.execute(
      `INSERT INTO wallet_transactions (
        wallet_account_id,
        user_id,
        transaction_type,
        amount,
        balance_before,
        balance_after,
        reference,
        description,
        status,
        metadata
      ) VALUES (?, ?, 'withdraw', ?, ?, ?, ?, ?, 'completed', ?)` ,
      [wallet.id, userId, amount, balanceBefore, balanceAfter, reference, `${bankName} • ${accountNumber.slice(-4)}`, JSON.stringify({ bankName, accountNumber })]
    );

    await connection.commit();

    const meta = Array.isArray(transactionResult) ? transactionResult[0] : transactionResult;
    const transactionId = (meta as any).insertId;

    res.status(201).json({
      success: true,
      message: 'Withdrawal submitted successfully',
      data: {
        wallet: {
          id: wallet.id,
          balance: balanceAfter,
          currency: wallet.currency,
        },
        transactionId,
        reference,
      },
    });
  } catch (error) {
    try {
      await connection.rollback();
    } catch {
      // ignore rollback errors
    }

    console.error('Withdraw wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing the withdrawal',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};
