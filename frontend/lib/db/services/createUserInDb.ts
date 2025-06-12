
import { connectDatabase } from "@/connectDatabase";

import mongoose from "mongoose";
import { verifyPassword } from "@/lib/db/hash/hash";
import { findUserByEmail } from "./validateLogin";
import { BaseUser,OAuthUser } from "../models/user";


export const createUserInDb = async (userData: {
  name: string;
  email: string;
  password?: string;
  oauthId?: string;
  oauthProvider?: string;
}) => {
  await connectDatabase();
  const { name, email, password, oauthId, oauthProvider } = userData;
  // Verificar si el usuario ya existe
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("El usuario ya existe");
  }
  // Crear un nuevo usuario
  let newUser;
  if (oauthId && oauthProvider) {
    // Crear un usuario OAuth
    newUser = new OAuthUser({
      username: name,
      email,
      oauthId,
      oauthProvider,
    });
  } else {
    // Crear un usuario normal    
    newUser = new BaseUser({
      username: name,
      email,
      password, // La contraseña se hasheará en el pre-save hook
    });
  }

  await newUser.save();
  return newUser;
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
