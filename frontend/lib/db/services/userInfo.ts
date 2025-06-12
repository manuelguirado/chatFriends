import { normalUser } from './../models/user';

import { user } from '@/lib/db/models/user';
import { connectDatabase } from '@/lib/db/connectDatabase';
import { findUserByEmail } from '@/lib/db/services/validateLogin';


function selectUserType(type: "user" | "oauth" | "guest"): string {
  switch (type) {
    case "user":
      return JSON.stringify(new User("Default Name", "default@email.com", "user"));
    case "oauth":
      return JSON.stringify(new oauthUser("Default Name", "default@email.com", "provider"));
    
    default:
      return "Unknown";
  }
}
let type: "user" | "oauth" | "guest" = "user"; // Example type, can be changed to "oauth" or "guest"
let userType = selectUserType(type  );
if (type === "user") {
    handleNormalUser();

}
else if (type === "oauth") {
    handleOauthUser();
}
  
function handleNormalUser() {
    try {
        const userData = JSON.parse(userType);
        return { User: userData.getUserInfo() };
    } catch (error) {
        console.error("Error parsing user data:", error);
        return { error: "Invalid user data" };
    }
}
function handleOauthUser() {
    try {
        const oauthData = JSON.parse(userType);
        return { OauthUser: oauthData.getUserInfo() };
    } catch (error) {
        console.error("Error parsing OAuth user data:", error);
        return { error: "Invalid OAuth user data" };
    }
}