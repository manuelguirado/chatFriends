import { connectDatabase } from "@/connectDatabase";
import { BaseUser } from "@/lib/db/models/user";

export const getFriends = async (email: string) => {
  await connectDatabase();
  return await BaseUser.findOne({ email }).populate("friends");
};
