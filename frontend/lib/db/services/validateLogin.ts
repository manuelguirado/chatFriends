import { connectDatabase } from "@/connectDatabase";
import { BaseUser, OAuthUser } from "../models/user";
import type { Document } from "mongoose";
import { verifyPassword } from "@/lib/db/hash/hash";

export const findUserByEmail = async (email: string) => {
  try {
    await connectDatabase();

    const normalUser = await BaseUser.findOne({ email });
    if (normalUser) return { type: "user", user: normalUser };

    // Busca en la colección de usuarios OAuth
    const oauthUser = await OAuthUser.findOne({ email });
    if (oauthUser) return { type: "oauth", user: oauthUser };
    return null; // Si no se encuentra el usuario en ninguna colección
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
    throw error;
  }
};

export const checkUserCredentials = async (email: string, password: string) => {
  const userFound = await findUserByEmail(email);

  if (!userFound) {
    return { success: false, message: "Usuario no encontrado" };
  }

  if ("password" in userFound && userFound.password) {
    const isValid = await verifyPassword(
      password,
      (userFound as { password: string }).password
    );
    if (!isValid) {
      return { success: false, message: "Contraseña incorrecta" };
    }
    return { success: true, user: userFound };
  }
};
