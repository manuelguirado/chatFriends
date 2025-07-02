import { connectDatabase } from "@/connectDatabase";
import { BaseUser } from "@/lib/db/models/user";

export const getFriends = async (email: string) => {
  await connectDatabase();

  const user = await BaseUser.findOne({ email }).populate("friends");
  return user?.friends || [];
};
