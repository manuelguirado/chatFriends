import { BaseUser, OAuthUser } from '@/lib/db/models/user';
import { connectDatabase } from '@/connectDatabase';
import { findUserByEmail } from '@/lib/db/services/validateLogin';
import { selectUserInfo } from '@/lib/utils/selectInfo';

async function handleUserByEmail(email: string) {
  try {
    await connectDatabase();
    console.log("Connected to the database");

    const searchByEmail = await findUserByEmail(email);
    if (!searchByEmail) {
      return { error: "User not found" };
    }

    const { user, type } = searchByEmail;
    const userInfo = selectUserInfo(user);

    if (type === "user") {
      return { User: userInfo };
    } else if (type === "oauth") {
      return { OAuthUser: userInfo };
    } else {
      return { error: "Unknown user type" };
    }
  } catch (error) {
    console.error("Error handling user:", error);
    return { error: "Invalid user data" };
  }
}
export { handleUserByEmail };