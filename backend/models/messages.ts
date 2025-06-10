import mongoose from 'mongoose';
interface Message {
    chatID : mongoose.Types.ObjectId;
    idUser?: string;
    TimeStamp: Date;    
    readyBy? : string[];
    content: string;
}
const messageSchema = new mongoose.Schema<Message>({
    chatID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    idUser: {
        type: mongoose.Types.ObjectId,
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
    toJSON : {
        virtuals: true,
    },
    toObject : {
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

export const Message = mongoose.models.Message || mongoose.model<Message>('Message', messageSchema);
