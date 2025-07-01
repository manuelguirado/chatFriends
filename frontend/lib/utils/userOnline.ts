import { connectDatabase } from "@/connectDatabase";
import { BaseUser } from "@/lib/db/models/user";

export const setUserOnline = async (userId: string) => {
  await connectDatabase();
  if (userId) {

  await BaseUser.findByIdAndUpdate(userId, { isOnline: true });
  }else{
      await BaseUser.updateMany({}, { isOnline: false });
  }
};

