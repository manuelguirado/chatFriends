"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChatID = generateChatID;
exports.getParticipants = getParticipants;
// utils/chatUtils.ts
var crypto_1 = require("crypto");
function generateChatID(email1, email2) {
    try {
        // ✅ Validar inputs
        if (!email1 || typeof email1 !== 'string') {
            console.error("❌ generateChatID: Invalid email1:", email1);
            throw new Error("Invalid email1: ".concat(email1));
        }
        if (!email2 || typeof email2 !== 'string') {
            console.error("❌ generateChatID: Invalid email2:", email2);
            throw new Error("Invalid email2: ".concat(email2));
        }
        console.log("🔧 generateChatID inputs:", { email1: email1, email2: email2 });
        // Normalizar y ordenar emails para consistencia
        var normalizedEmails = [
            email1.toLowerCase().trim(),
            email2.toLowerCase().trim(),
        ].sort();
        // Crear hash único pero determinístico
        var combined = normalizedEmails.join("|");
        return crypto_1.default
            .createHash("sha256")
            .update(combined)
            .digest("hex")
            .substring(0, 16);
    }
    catch (error) {
        console.error("❌ Error in generateChatID:", error);
        throw error;
    }
}
function getParticipants(email1, email2) {
    try {
        // ✅ Validar inputs
        if (!email1 || typeof email1 !== 'string') {
            console.error("❌ getParticipants: Invalid email1:", email1);
            throw new Error("Invalid email1: ".concat(email1));
        }
        if (!email2 || typeof email2 !== 'string') {
            console.error("❌ getParticipants: Invalid email2:", email2);
            throw new Error("Invalid email2: ".concat(email2));
        }
        return [email1.toLowerCase().trim(), email2.toLowerCase().trim()].sort();
    }
    catch (error) {
        console.error("❌ Error in getParticipants:", error);
        throw error;
    }
}
