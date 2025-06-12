import mongoose from 'mongoose';
import { BaseUser } from '../models/user';
type userData = {
    name: string;
    email: string;
    password?: string;
    oauthId?: string;
    oauthProvider?: string;
}
export const userFactory = {
    cr
}