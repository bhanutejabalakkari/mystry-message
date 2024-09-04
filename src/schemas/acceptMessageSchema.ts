import { string, z } from "zod";

export const acceptMessageSchema = z.object({
    acceptMessages: z.boolean()
})

export const sendMessageSchema = z.object({
    username: z.string(),
    content: z.string().min(5, {message: "message must be minimum of 5 characters"})
})