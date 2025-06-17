import { connectDatabase } from "@/connectDatabase";
import { BaseUser, OAuthUser } from "../models/user";

import { verifyPassword } from "@/lib/db/hash/hash";

export const findUserByEmail = async (email: string) => {
  try {
    await connectDatabase();

    const normalUser = await BaseUser.findOne({ email });
    console.log("Normal user found:", normalUser);
    console.log("email :", email);
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
  console.log("password received in checkUserCredentials:", password)
  console.log ("email received in checkUserCredentials:", email);
  console.log("User found in checkUserCredentials:", userFound);
  if (!userFound) {
    return { success: false, message: "Usuario no encontrado" };
  } else {
    console.log("User found:", userFound);
  }

  if (!userFound) {
    return { success: false, message: "Usuario no encontrado" };
  }

  if (userFound.type === "user" && userFound.user.password) {
    const isValid = await verifyPassword(
      password,
      userFound.user.password
    );
    console.log("Password verification result:", isValid);
    if (!isValid) {
      return { success: false, message: "Contraseña incorrecta" };
    }
    return { success: true, user: userFound };
  }
  return { success: false, message: "Usuario no tiene contraseña" };
};
