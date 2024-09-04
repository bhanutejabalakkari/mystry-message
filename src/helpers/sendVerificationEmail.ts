import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {

        console.log("Email is sending to ", email, "with username ", username);
        

        const response = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Mystry Message | Verififcation code",
            react: VerificationEmail({username: username, otp: verifyCode})
        });

        console.log("The Email response is --> ", response.error);
        
        return {
            success: true,
            message: "Verification email sent successfully"
        }
    } catch (e) {
        console.log("error while sending verification email");
        return {success: false, message: "Failed to send verification email"}
    }
}