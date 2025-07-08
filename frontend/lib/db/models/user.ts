import mongoose, { Schema, Document } from "mongoose";
import { hashPassword } from "../hash/hash";

// --- Interfaces ---
export interface IBaseUser extends Document {
  username: string;
  email: string;
  password?: string; // opcional por si es OAuth
  friends?: mongoose.Types.ObjectId[]; // opcional, lista de IDs de amigos
  isOnline?: boolean; // opcional, estado de conexión
}


export interface IOAuthUser extends IBaseUser {
  name: string; // nombre del usuario, requerido para OAuth
  oauthId: string;
  oauthProvider: string;
  profilePicture?: string; // opcional, puede ser útil para OAuth
  
}

// --- Schema base ---
const baseUserSchema = new Schema<IBaseUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Opcional para OAuth
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "BaseUser", default: [] }], // Referencia a otros usuarios
    isOnline: { type: Boolean, default: false }, // Estado de conexión
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
const BaseUser =
  mongoose.models.BaseUser ||
  mongoose.model<IBaseUser>("BaseUser", baseUserSchema);


// --- Discriminador para usuarios OAuth ---
let OAuthUser: mongoose.Model<IOAuthUser>;

if (BaseUser.discriminators?.OAuthUser) {
  OAuthUser = BaseUser.discriminators.OAuthUser as mongoose.Model<IOAuthUser>;
} else {
  OAuthUser = BaseUser.discriminator<IOAuthUser>(
    "OAuthUser",
    new Schema<IOAuthUser>({
      name: { type: String, required: true },
      oauthId: { type: String, required: true },
      oauthProvider: { type: String, required: true },
      profilePicture: { type: String },
    })
  );
}


// --- Exportación ---
export { BaseUser, OAuthUser };
