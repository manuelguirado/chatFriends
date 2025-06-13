import mongoose from 'mongoose';
import { BaseUser,OAuthUser } from '../models/user';
type UserType = "user" | "oauth";

interface BaseUserData {
  name: string;
  email: string;
  password: string;
}

interface OAuthUserData {
  name: string;
  email: string;
  oauthId: string;
  oauthProvider: string;
}

export function userFactory(type: "user", userData: BaseUserData): InstanceType<typeof BaseUser>;
export function userFactory(type: "oauth", userData: OAuthUserData): InstanceType<typeof OAuthUser>;
export function userFactory(type: UserType, userData: any) {
  switch (type) {
    case "user":
      return new BaseUser({
        username: userData.name,
        email: userData.email,
        password: userData.password,
      });
    case "oauth":
      return new OAuthUser({
        username: userData.name,
        email: userData.email,
        oauthId: userData.oauthId,
        oauthProvider: userData.oauthProvider,
      });
    default:
      throw new Error("Tipo de usuario no válido");
  }
}
export function getUserInfo(this: any) {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    ...(this.oauthId && {
      oauthId: this.oauthId,
      oauthProvider: this.oauthProvider,
      profilePicture: this.profilePicture,
    }),
  };
}
BaseUser.prototype.getUserInfo = getUserInfo;
OAuthUser.prototype.getUserInfo = getUserInfo;