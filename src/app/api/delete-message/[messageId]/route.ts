import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";


export async function DELETE( request: Request, { params }: { params: { messageId: string } } ) {

    const messageId = params.messageId
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    const user = session.user as User;

    try {
        const updateResult = await UserModel.updateOne(
            { id: user._id },
            { $pull: { messages: { _id: messageId } } }
        )
        if (updateResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, { status: 200 })

    } catch (error) {

        console.log("Error while deleting the mwssage ", error);
        
        return Response.json({
            success: false,
            message: "Error while deleting the message"
        }, { status: 500 })
    }

    

    

}