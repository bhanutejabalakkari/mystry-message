import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401});
    }

    const user = session.user;
    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessages }, { new: true });

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            message: "Message acceptance status changed",
            updatedUser
        }, { status: 200 }) 


    } catch (error) {
        console.log("Error while updating user status to accept messages");
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 500 })
    }

}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    const user = session.user;
    const userId = user._id;

    try {
        const userFound = await UserModel.findById(userId);
    
        if (!userFound) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
    
        return Response.json({
            success: true,
            message: "",
            isAccetptingMessages: userFound.isAcceptingMessages
        }, { status: 200 });
    } catch (error) {
        console.log("Error while getting user accepting messages status");
        return Response.json({
            success: false,
            message: "Failed to fetch user accepting messages status"
        }, { status: 500 })
    }

}