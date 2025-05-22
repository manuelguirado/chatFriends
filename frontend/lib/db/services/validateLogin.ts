
import { connectDatabase } from "../connectDatabase";
import { User, oauthUser, normalUser, user } from "../models/user";
import { verifyPassword } from "@/lib/db/hash/hash";



export const findUserByEmail = async (email: string) => {
  await connectDatabase();

  try {
    let foundUser: oauthUser | normalUser | null = null;
    foundUser = await User.findOne({ email});
     

    if (!foundUser) {
      console.error("Usuario no encontrado");
      return null;
    }
    return foundUser;
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
    throw error;
  }
};
export const checkUserCredentials = async (email: string, password: string) => {
  const userFound: user | null = await findUserByEmail(email);

  if (!userFound) {
    return { success: false, message: "Usuario no encontrado" };
  }

  if ("password" in userFound && userFound.password) {
    const isValid = await verifyPassword(password, userFound.password);
    if (!isValid) {
      return { success: false, message: "Contraseña incorrecta" };
    }
    return { success: true, user: userFound };
  } else {
    return {
      success: false,
      message: "Este usuario solo puede iniciar sesión con Google",
    };
  }
};