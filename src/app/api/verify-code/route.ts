import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();

        const user = await UserModel.findOne({username});

        if (!user) {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {status: 404});
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User verified successfully, Please Sign in to enjoy"
            }, { status: 200 })
        } else if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "code is invalid"
            }, { status: 400 })
        } else {
            return Response.json({
                success: false,
                message: "Verification code has expired, Please sign up again to get new verification code"
            }, { status: 400 })
        }



    } catch (error) {
        console.log("Error while verifying code ", error);
        return Response.json({
            success: false,
            message: "Error while verifying the code"
        }, {status: 500});
    }
}