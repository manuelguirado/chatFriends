import { connectDatabase } from "@/connectDatabase";
import { BaseUser } from "@/lib/db/models/user";
import mongoose from "mongoose";

export const setUserOnline = async (userIdentifier: string, isEmail: boolean = false) => {
  await connectDatabase();
   
  if (userIdentifier) {
    if (isEmail) {
      // Buscar por email
      await BaseUser.findOneAndUpdate(
        { email: userIdentifier }, 
        { isOnline: true }
      );
    } else {
      // Buscar por ID (validar primero)
      if (mongoose.Types.ObjectId.isValid(userIdentifier)) {
        await BaseUser.findByIdAndUpdate(userIdentifier, { isOnline: true });
      }
    }
  } else {
    await BaseUser.updateMany({}, { isOnline: false });
  }
};
