// utils/chatUtils.ts
import crypto from "crypto";

export function generateChatID(email1: string, email2: string): string {
  try {
    // ✅ Validar inputs
    if (!email1 || typeof email1 !== 'string') {
      console.error("❌ generateChatID: Invalid email1:", email1);
      throw new Error(`Invalid email1: ${email1}`);
    }
    if (!email2 || typeof email2 !== 'string') {
      console.error("❌ generateChatID: Invalid email2:", email2);
      throw new Error(`Invalid email2: ${email2}`);
    }

    console.log("🔧 generateChatID inputs:", { email1, email2 });

    // Normalizar y ordenar emails para consistencia
    const normalizedEmails = [
      email1.toLowerCase().trim(),
      email2.toLowerCase().trim(),
    ].sort();

    // Crear hash único pero determinístico
    const combined = normalizedEmails.join("|");
    return crypto
      .createHash("sha256")
      .update(combined)
      .digest("hex")
      .substring(0, 16);
  } catch (error) {
    console.error("❌ Error in generateChatID:", error);
    throw error;
  }
}

export function getParticipants(email1: string, email2: string): string[] {
  try {
    // ✅ Validar inputs
    if (!email1 || typeof email1 !== 'string') {
      console.error("❌ getParticipants: Invalid email1:", email1);
      throw new Error(`Invalid email1: ${email1}`);
    }
    if (!email2 || typeof email2 !== 'string') {
      console.error("❌ getParticipants: Invalid email2:", email2);
      throw new Error(`Invalid email2: ${email2}`);
    }

    return [email1.toLowerCase().trim(), email2.toLowerCase().trim()].sort();
  } catch (error) {
    console.error("❌ Error in getParticipants:", error);
    throw error;
  }
}
