import { z } from "zod";

export const signInSchema = z.object({
    identifier: z.string().min(1, "username or password should not be empty"),
    password: z.string().min(6, {message: "password must be at least 6 characters"})
})