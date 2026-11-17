import mysql from 'mysql2/promise';
import { ensure } from './schema';
const g = globalThis;
export const db = g._pool || (g._pool = mysql.createPool({ uri: process.env.DATABASE_URL, ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined, connectionLimit: 5 }));
export const q = async (sql, p = []) => { await (g._ready || (g._ready = ensure(db))); return (await db.query(sql, p))[0]; };
