'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


function Page() {

    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

   

    const debounced = useDebounceCallback(setUsername, 1000);
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });

    const checkUsernameUnique = async () => {
        if (username) {
            setIsCheckingUsername(true);
            setUsernameMessage("");
            try {
                const response = await axios.get(`/api/check-username-unique?username=${username}`);
                setUsernameMessage(response.data.message);
            } catch (error) {
                
                const axiosError = error as AxiosError<ApiResponse>;
                
                setUsernameMessage(axiosError.response?.data.message ?? "Error while checking username");
            } finally {
                setIsCheckingUsername(false);
            }
        } else {
            setUsernameMessage("");
        }
        
    }

    const onSubmit = async ( data: z.infer<typeof signUpSchema> ) => {
        setIsSubmitting(true);
        setUsernameMessage("");
        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", data);
            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace(`/verify/${username}`)
        } catch (error) {
            console.error("Error while signing-up the user ", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        checkUsernameUnique();
    }, [username]);


    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg border-[1.9px] border-gray-300">

                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystry Message</h1>
                    <p className="mb-4">Signup to start your anonymous adventure</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="username" 
                                        {...field} 
                                        onChange={(e) => {
                                            field.onChange(e);
                                            debounced(e.target.value)
                                        }}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                { isCheckingUsername && <Loader2 className="mt-4 h-4 animate-spin"/> }
                                { usernameMessage.length > 0 && !isCheckingUsername &&  
                                <p className={`text-sm pl-1 ${usernameMessage === "username is available" ? "text-green-500" : "text-red-500"}`}>
                                    {"  "}{usernameMessage}
                                </p>
                                }
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="email"
                                        type="email" 
                                        {...field}
                                        disabled={isSubmitting} 
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="password" 
                                        type="password"
                                        {...field}
                                        disabled={isSubmitting} 
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Sign Up" }
                        </Button>

                    </form>
                </Form>

                <div className="text-center mt-4">
                    <p>
                        Already a member?{" "}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign In</Link>
                    </p>
                </div>
                
            </div>
        </div>
    );

}

export default Page;
