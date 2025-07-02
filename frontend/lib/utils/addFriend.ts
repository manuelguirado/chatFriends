
import { handleUserByEmail } from '@/lib/utils/handleUser';
import { connectDatabase } from "@/connectDatabase";
import { NextResponse } from "next/server";
import {getFriends} from '@/lib/utils/getFriends';

export default async function addFriend(email : string) {
    try {
          if (!email) {
        return NextResponse.json( { error: "Email is required" }, { status: 400 });
    }
         await connectDatabase();
        const user = await handleUserByEmail(email);
        if (!user || 'error' in user) {
            return NextResponse.json( { error: "User not found" }, { status: 404 });
        }
        // Check if the user is already a friend
        const currentUser = await getFriends(user.email);
        if (currentUser.friends.some((friend : { email: string })  => friend.email === user.email)) {
            return NextResponse.json( { error: "User is already a friend" }, { status: 400 });
        }
        currentUser.friends.push(user);
        await currentUser.save();
        return NextResponse.json( { message: "Friend added successfully" }, { status: 200 });

    }catch (error) {
        console.error("Error adding friend:", error);
        return NextResponse.json( { error: "Error adding friend" }, { status: 500 });
    }
}