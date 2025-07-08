
import type { IBaseUser, IOAuthUser } from "@/lib/db/models/user";


// Type guard to check if a user is an OAuth user
function isOAuthUser(user: IBaseUser | IOAuthUser): user is IOAuthUser {
  return 'oauthId' in user && 'oauthProvider' in user;
}

function selectUserInfo(user: IBaseUser | IOAuthUser) {
  if (!isOAuthUser(user)) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
    };

  } else {
    return {
      id: user._id,
      username: user.username ??  user.name,  // <-- aquí usamos name
      email: user.email,
      oauthId: user.oauthId,
      oauthProvider: user.oauthProvider,
      profilePicture: user.profilePicture,
    };
  }

  }



export { selectUserInfo };