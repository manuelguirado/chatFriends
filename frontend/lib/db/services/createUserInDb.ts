import { connectDatabase } from "../connectDatabase";

import mongoose from "mongoose";
import { verifyPassword } from "@/lib/db/hash/hash";
import { findUserByEmail } from "./validateLogin";
import { User } from "../models/user"; // Adjusted path to match the actual file name


export const createUserInDb = async (userData: {
  name: string;
  email: string;
  password?: string;
  oauthId?: string;
  oauthProvider?: string;
}) => {
  await connectDatabase();
  const { name, email, password, oauthId, oauthProvider } = userData;


const newUser = new User({
  _id: new mongoose.Types.ObjectId(),
  name,
  email,
  password: oauthProvider ? undefined : password, // si es OAuth no guarda password
  oauthId,
  oauthProvider,
});

  try {
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error("Error al guardar el usuario:", error);
    throw error;
  }
};

export const checkUserCredentials = async (email: string, password: string) => {
  const userFound = await findUserByEmail(email);

  if (!userFound) {
    return { success: false, message: "Usuario no encontrado" };
  }

  if ("password" in userFound && userFound.password) {
    // Es un usuario normal
    const isValid = await verifyPassword(password, userFound.password);
    if (!isValid) {
      return { success: false, message: "Contraseña incorrecta" };
    }

    return { success: true, user: userFound };
  } else {
    // Es un usuario OAuth, no debería intentar loguear con contraseña
    return {
      success: false,
      message: "Este usuario solo puede iniciar sesión con Google",
    };
  }
};
