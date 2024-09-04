import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";


export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    const user = session.user as User;
    const userId = new mongoose.Types.ObjectId(user._id);
    // console.log("api :: get-messages :: GET :: user :: ", user._id);

    try {

        const user = await UserModel.aggregate([
            {
                $match: { _id: userId }
            },
            {
                $unwind: '$messages'
            },
            {
                $sort: { 'messages.createdAt': -1 }
            },
            {
                $group: { _id: '$_id', messages: { $push: '$messages' } }
            }
        ]);

        // console.log("api :: get-messages :: GET :: user :: ", user);

        // return Response.json({
        //     success: true,
        //     message: "No messages found"
        // }, { status: 404 });

        if (!user || !user.length) {
            if (!user) {
                return Response.json({
                    success: false,
                    message: "User not found"
                }, { status: 404 });
            }
            console.log("api :: get-messages :: GET :: user :: ", user);
            

            if (!user.length) {
                return Response.json({
                    success: true,
                    message: "No messages found"
                }, { status: 404 });
            }
            
        }

        return Response.json({
            success: true,
            message: "messages fetched successfully",
            messages: user[0].messages
        }, { status: 200 });


    } catch (error) {
        console.log("Error while getting messages ", error);
        return Response.json({
            success: false,
            message: "could not get messages"
        }, { status: 500 });
    }

}