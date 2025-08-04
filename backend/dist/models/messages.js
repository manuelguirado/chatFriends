"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    chatID: {
        type: String, // ✅ String en lugar de ObjectId
        required: true,
        index: true, // ✅ Índice para performance
    },
    participants: {
        type: [String], // ✅ Array de emails participantes
        required: true,
        index: true,
    },
    senderEmail: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true, // ✅ Índice para ordenar por fecha
    },
    readBy: {
        type: [String],
        default: [],
    }
});
// ✅ Índice compuesto para búsquedas eficientes
messageSchema.index({ chatID: 1, timestamp: 1 });
exports.Message = mongoose_1.default.models.Message || mongoose_1.default.model('Message', messageSchema);
