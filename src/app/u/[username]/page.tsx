'use client'

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { sendMessageSchema } from "@/schemas/acceptMessageSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message"
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/use-toast";
import { useCompletion } from "ai/react";
import { Inter } from "next/font/google";
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton";
const inter = Inter({ subsets: ["latin"] });

function PublicProfilePage() {

    const params = useParams();
    const router = useRouter();
    const username = params?.username as string;
    
   
    const { complete, completion, isLoading: isSuggestingMessages, error, handleSubmit: chatHandleSubmit } = useCompletion({
        api: "/api/suggest-messages"
    });

    

    useEffect(() => {
        suggestMessages()
    }, [])

   

    useEffect(() => {
        if (error) {
            toast({
                title: error.name,
                description: error.message
            })
        }
    }, [error]);

    const { register, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof sendMessageSchema>>({
        resolver: zodResolver(sendMessageSchema),
        defaultValues: {
            username: username,
            content: ""
        }
    })

    const submit: SubmitHandler<z.infer<typeof sendMessageSchema>> = async (data) => {
        // setIsSubmitting(true);
        
        // setIsSubmitting(false);
        try {
            const response = await axios.post("/api/send-message", data);
            if (response.data.success) {
                toast({
                    title: "Message Sent Successfully"
                })
                setValue("content", "")
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError?.response?.data?.message
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            })
        } 
    }

    const copyToTextArea = (event: any) => {
       
        console.dir(event.target.innerText);
        setValue("content", event.target.innerText);
        
    }

    const suggestMessages = async () => {
    
        try {
            await complete("Give me some good new suggestions gemini");
            
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast({
                title: "Failed to suggest messages",
                description: errorMessage || "something went wrong",
                variant: "destructive"
            })
        } 
    }
 
    

    return (
        <div className={`min-w-full min-h-screen bg-[#F7F7FF] flex flex-col ${inter.className}`}>
            <h1 className="text-black text-2xl text-center font-bold p-4">Public Profile</h1>
            <div className="flex-1 flex flex-col overflow-auto items-center">
                <div className="rounded-lg shadow-md flex flex-2 flex-col md:items-center bg-white w-[95%] mb-1 lg:w-[90%] px-5 md:px-8 lg:px-5 pt-2">
                    <div className="w-full lg:w-4/5">
                    <div className="w-full lg:mt-2">
                    <h1 className="text-left mb-2 mt-2">Send Anonymous messages to @<span className="font-semibold">{username}</span></h1>
                    </div>
                    <form onSubmit={handleSubmit(submit)} className="flex flex-col md:items-start lg:items-center w-full ">
                        <textarea 
                            placeholder="Write Your Message Here..."
                            id="message-box" 
                            className="w-full h-20 border-solid border resize-none border-gray-200 rounded focus:border-[1.5px] focus:border-slate-400 focus:outline-none p-2 overflow-auto"
                            {...register("content")}
                        >
                        </textarea>
                        <ErrorMessage
                            errors={errors}
                            name="content"
                            render={({ message }) => <p className="text-red-500 text-left w-full mt-1 pl-1">{message}</p>}
                        />
                        <div className="w-full flex justify-center">
                            <Button className="my-4" type="submit" size="default">
                                {
                                    isSubmitting ? (<><Loader2 className="animate-spin mr-2 h-5 w-5" />Sending...</>) : ("Send")
                                }
                                
                            </Button>
                        </div>
                    </form>
                    </div>
                </div>
                <div className="bg-white w-[95%] lg:w-[90%] flex-1 mt-2 mb-5 rounded-lg shadow-md flex flex-col justify-start md:items-center px-5">
                    <div className="flex flex-col justify-start items-start mt-5 mb-3 w-full lg:w-4/5">
                        <form onSubmit={chatHandleSubmit}>
                        <Button type="submit" onClick={suggestMessages} disabled={isSuggestingMessages}>
                            { isSuggestingMessages ? (<><Loader2 className="animate-spin w-5 h-5 mr-2"/>Suggesting...</>) : ("Suggest Messages") }
                        </Button>
                        </form>
                        <h1 className="mt-3 pl-1">Click on below messages to copy to the message board</h1>
                    </div>
                    <div className="flex flex-col justify-evenly items-center w-full lg:w-4/5 rounded-md h-auto border-solid border-2">
                        <h1 className="text-black font-semibold text-lg w-[95%] text-left my-3 pl-2">Messages</h1>
                        {
                            completion.length > 0 ? completion.split("||").map((value, index) =>  {
                                return (
                                    
                                    <div key={index} onClick={copyToTextArea} className="hover:bg-slate-100 hover:cursor-pointer w-[95%] border h-auto lg:h-[40px] rounded-md mb-3 lg:mb-10 text-center py-2 lg:py-2 px-3 font-normal lg:truncate">{value}</div>
                                    
                                );
                            }) : Array.from({length: 3}).map((_, index) => {
                                return (
                                    <Skeleton key={index} className="h-16 sm:h-10 w-[95%] mb-3 lg:mb-10 bg-gray-200"/>
                                );
                            })
                        }
                    </div>
                    <Separator className="my-5"/>
                    <div className="flex flex-col items-center">
                        <h1 className="font-normal mb-5">Get Your Message Board</h1>
                        <Button className="mb-5" onClick={() => router.push("/sign-up")}>Create Your Account</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PublicProfilePage;