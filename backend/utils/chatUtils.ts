// utils/chatUtils.ts
import crypto from 'crypto';

export function generateChatID(email1: string, email2: string): string {
  // Normalizar y ordenar emails para consistencia
  const normalizedEmails = [
    email1.toLowerCase().trim(),
    email2.toLowerCase().trim()
  ].sort();
  
  // Crear hash único pero determinístico
  const combined = normalizedEmails.join('|');
  return crypto.createHash('sha256').update(combined).digest('hex').substring(0, 16);
}

export function getParticipants(email1: string, email2: string): string[] {
  return [email1.toLowerCase().trim(), email2.toLowerCase().trim()].sort();
}