import crypto from 'crypto';
export const newCode = (p) => p + '-' + Array.from(crypto.randomBytes(6), (b) => 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[b % 31]).join('');
