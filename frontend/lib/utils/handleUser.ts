import { BaseUser, OAuthUser } from '@/lib/db/models/user';
import { connectDatabase } from '@/connectDatabase';
import { findUserByEmail } from '@/lib/db/services/validateLogin';
import { selectUserInfo } from '@/lib/utils/selectInfo';

async function handleUserByEmail(email: string) {
  try {
    await connectDatabase();
    console.log("Connected to the database");

    const searchByEmail = await findUserByEmail(email);
    console.log("User found by email:", searchByEmail);
    if (!searchByEmail) {
      return { error: "User not found" };
    }

    const { user, type } = searchByEmail;
    const userInfo = selectUserInfo(user); 
    console.log("Selected user info:", userInfo);
    
    if (type === "user") {
      const { username } = userInfo;
      return { email };
    } else if (type === "oauth") {
      return { email, profilePicture: userInfo.profilePicture };
    } else {
      return { error: "Unknown user type" };
    }
  } catch (error) {
    console.error("Error handling user:", error);
    return { error: "Invalid user data" };
  }
}
export { handleUserByEmail };