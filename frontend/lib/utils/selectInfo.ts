
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
            password: user.password, // Incluye la contraseña solo si es un usuario normal
           
        };
    } else {
        return {
            id: user._id,
            username: user.username,
            email: user.email,
            oauthId: user.oauthId,
            oauthProvider: user.oauthProvider,
            profilePicture: user.profilePicture, // Incluye la imagen de perfil si es un usuario OAuth
        };
    }

}
export { selectUserInfo };