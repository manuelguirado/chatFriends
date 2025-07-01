import { connectDatabase } from "@/connectDatabase";
import { BaseUser } from "@/lib/db/models/user";

export const getFriends = async (userId: string) => {
  await connectDatabase();

  const user = await BaseUser.findById(userId).populate("friends");
  return user?.friends || [];
};
