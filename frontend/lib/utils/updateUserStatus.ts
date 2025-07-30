import { connectDatabase } from "../../connectDatabase";
import { BaseUser } from "../db/models/user";

/**
 * Actualiza el estado online/offline de un usuario en la base de datos
 */
export const updateUserStatus = async (userId: string, isOnline: boolean): Promise<void> => {
  try {
    await connectDatabase();
    
    await BaseUser.findByIdAndUpdate(
      userId,
      {
        isOnline,
        lastOnline: new Date(),
      },
      { new: true }
    );
    
    console.log(`✅ Usuario ${userId} actualizado: ${isOnline ? 'online' : 'offline'}`);
  } catch (error) {
    console.error("❌ Error actualizando estado del usuario:", error);
    throw error;
  }
};

/**
 * Actualiza el estado de un usuario por email
 */
export const updateUserStatusByEmail = async (email: string, isOnline: boolean): Promise<void> => {
  try {
    await connectDatabase();
    
    await BaseUser.findOneAndUpdate(
      { email },
      {
        isOnline,
        lastOnline: new Date(),
      },
      { new: true }
    );
    
    console.log(`✅ Usuario ${email} actualizado: ${isOnline ? 'online' : 'offline'}`);
  } catch (error) {
    console.error("❌ Error actualizando estado del usuario por email:", error);
    throw error;
  }
};
