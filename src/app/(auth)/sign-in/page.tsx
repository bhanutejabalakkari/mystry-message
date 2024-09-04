'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";


function SignInPage() {

   
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    });

    

    const onSubmit = async ( data: z.infer<typeof signInSchema> ) => {
        setIsSubmitting(true);
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        });

        if (result?.error) {
            
            if(result.error === "CredentialsSignIn"){
                toast({
                    title: "Login Failed",
                    description: "Incorrect username/email or password",
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error.substring(7) ?? "Something went wrong"
                })
            }
        }

        if (result?.url) {
            
            router.push("/dashboard");
        }

     

        setIsSubmitting(false);
    }

    

    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg border-solid  border-[1.9px] border-gray-300">

                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystry Message</h1>
                    <p className="mb-4">SignIn to start your anonymous adventure</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>email or username</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="email or username"
                                        type="text" 
                                        {...field}
                                        disabled={isSubmitting}
                                        className="focus:outline-none focus-visible:ring-0 border border-slate-300 focus-visible:border-[1.8px] focus-visible:border-slate-500 focus-visible:ring-offset-0" 
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
                                <FormLabel>password</FormLabel>
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
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Sign In" }
                        </Button>

                    </form>
                </Form>

                <div className="text-center mt-4">
                    <p>
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">Signup</Link>
                    </p>
                </div>
                
            </div>
        </div>
    );

}

export default SignInPage;
