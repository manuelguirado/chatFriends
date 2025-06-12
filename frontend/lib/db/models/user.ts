import mongoose, { Schema, Model, Document } from "mongoose";
import { hashPassword } from "../hash/hash";

// --- Interfaces ---

interface IBaseUser extends Document {
  username: string;
  email: string;
  password?: string; // opcional por si es OAuth
}

interface IOAuthUser extends IBaseUser {
  oauthId: string;
  oauthProvider: string;
}

// --- Schema base ---

const baseUserSchema = new Schema<IBaseUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Opcional para OAuth
  },
  { discriminatorKey: "type", collection: "users", timestamps: true }
);

// --- Hash password antes de guardar ---
baseUserSchema.pre("save", async function (next) {
  const user = this as IBaseUser;
  if (user.isModified("password") && user.password) {
    user.password = await hashPassword(user.password);
  }
  next();
});

// --- Modelo base ---
const BaseUser = mongoose.models.BaseUser || mongoose.model<IBaseUser>("BaseUser", baseUserSchema);

// --- Discriminador para usuarios OAuth ---
const OAuthUser = BaseUser.discriminator<IOAuthUser>(
  "OAuthUser",
  new Schema<IOAuthUser>({
    oauthId: { type: String, required: true },
    oauthProvider: { type: String, required: true },
  })
);

// --- Exportación ---
export { BaseUser, OAuthUser };
