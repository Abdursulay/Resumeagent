import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'users.db');
    db = new Database(dbPath);
    initializeSchema();
  }
  return db;
}

function initializeSchema() {
  if (!db) return;
  
  // Create users table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      verified BOOLEAN DEFAULT 0,
      verificationCode TEXT,
      verificationExpires INTEGER,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_email ON users(email);
  `);
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  verified: boolean;
  createdAt: string;
}

export function getUserByEmail(email: string): User | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT id, name, email, passwordHash, verified, createdAt FROM users WHERE email = ?');
  const row = stmt.get(email.toLowerCase()) as any;
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.passwordHash,
    verified: !!row.verified,
    createdAt: row.createdAt,
  };
}

export function createUser(
  name: string,
  email: string,
  passwordHash: string,
  verificationCode: string,
  verificationExpires: number
): User {
  const db = getDatabase();
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO users (id, name, email, passwordHash, verified, verificationCode, verificationExpires, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    name,
    email.toLowerCase(),
    passwordHash,
    0,
    verificationCode,
    verificationExpires,
    now,
    now
  );
  
  return {
    id,
    name,
    email: email.toLowerCase(),
    passwordHash,
    verified: false,
    createdAt: now,
  };
}

export function verifyUser(email: string, code: string): boolean {
  const db = getDatabase();
  const stmt = db.prepare('SELECT verificationCode, verificationExpires FROM users WHERE email = ?');
  const row = stmt.get(email.toLowerCase()) as any;
  
  if (!row) return false;
  if (row.verificationCode !== code) return false;
  if (row.verificationExpires < Date.now()) return false;
  
  const updateStmt = db.prepare(`
    UPDATE users SET verified = 1, verificationCode = NULL, verificationExpires = NULL, updatedAt = ?
    WHERE email = ?
  `);
  updateStmt.run(new Date().toISOString(), email.toLowerCase());
  
  return true;
}

export function updateVerificationCode(email: string, code: string, expiresIn: number): boolean {
  const db = getDatabase();
  const expires = Date.now() + expiresIn;
  
  const stmt = db.prepare(`
    UPDATE users SET verificationCode = ?, verificationExpires = ?, updatedAt = ?
    WHERE email = ?
  `);
  
  const result = stmt.run(code, expires, new Date().toISOString(), email.toLowerCase());
  return result.changes > 0;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
