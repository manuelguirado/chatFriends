
import mongoose  from "mongoose";
import {hashPassword} from "../hash/hash";
 export type oauthUser = {
    _id : mongoose.Types.ObjectId;
    name : string;
    email : string;
    oauthId : string;
    oauthProvider : string;
}
export type normalUser = {
    _id : mongoose.Types.ObjectId;
    name : string;
    email : string;
    password : string;
}
export type user = normalUser | oauthUser;

const userSchema = new mongoose.Schema<user>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    oauthId: {
        type: String,
        required: false,
    },
    oauthProvider: {
        type: String,
        required: false,
    }
},{
    collection :  'users',
});
userSchema.pre("save", async function (next) {
    const user = this as mongoose.Document & Partial<normalUser>;
    if (user.isModified("password") && user.password) {
        user.password = await hashPassword(user.password);
    }
    next();
});
export const User = mongoose.models.User || mongoose.model<user>('User', userSchema);


