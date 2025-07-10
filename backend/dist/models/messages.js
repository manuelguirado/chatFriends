"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    chatID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    idUser: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    TimeStamp: {
        type: Date,
        default: Date.now,
    },
    readyBy: {
        type: [String],
        default: [],
    },
    content: {
        type: String,
        required: true,
    }
}, {
    collection: 'messages',
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
});
//join the userID from the user collection from the idUser field
messageSchema.virtual('user', {
    ref: 'User',
    localField: 'idUser',
    foreignField: '_id',
    justOne: true,
});
exports.Message = mongoose_1.default.models.Message || mongoose_1.default.model('Message', messageSchema);
