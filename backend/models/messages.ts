import mongoose from 'mongoose';

interface IMessage {
  chatID: string; // Cambiar de ObjectId a String
  participants: string[]; // Array de emails
  senderEmail: string;
  content: string;
  timestamp: Date;
  readBy: string[];
}

const messageSchema = new mongoose.Schema<IMessage>({
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

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);
