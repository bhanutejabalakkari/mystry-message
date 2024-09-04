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
const inter = Inter({ subsets: ["latin"] });

function PublicProfilePage() {

    const params = useParams();
    const router = useRouter();
    const username = params?.username as string;
    
   
    const { complete, completion, isLoading: isSuggestingMessages, error, handleSubmit: chatHandleSubmit } = useCompletion({
        api: "/api/suggest-messages"
        
    });

    

    useEffect(() => {
        complete("Give me some new suggwstions");
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
            complete("Give me some good new suggestions gemini")
            
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
            <div className="flex-1 flex flex-col overflow-auto items-center p-3">
                <div className="rounded-lg shadow flex flex-2 flex-col items-center bg-white  w-[90%] p-2">
                    <h1 className="text-left w-3/4 mb-2 mt-2">Send Anonymous messages to @<span className="font-semibold">{username}</span></h1>
                    <form onSubmit={handleSubmit(submit)} className="flex flex-col items-center w-full">
                    <textarea 
                        placeholder="Write Your Message Here..."
                        id="message-box" 
                        className="w-3/4 h-20 border-solid border resize-none border-gray-200 rounded focus:border-[1.5px] focus:border-slate-400 focus:outline-none p-2 overflow-auto"
                        {...register("content")}
                    >
                    </textarea>
                    <ErrorMessage
                        errors={errors}
                        name="content"
                        render={({ message }) => <p className="text-red-500 text-left w-3/4">{message}</p>}
                    />
                    <Button className="mt-3 mb-3" type="submit" size="default">
                        {
                            isSubmitting ? (<><Loader2 className="animate-spin mr-2 h-5 w-5" />Sending...</>) : ("Send")
                        }
                        
                    </Button>
                    </form>
                </div>
                <div className="bg-white w-[90%] flex-1 mt-2 rounded-lg shadow-lg flex flex-col justify-start items-center">
                    <div className="flex flex-col justify-start items-start mt-5 mb-2 w-4/5">
                        <form onSubmit={chatHandleSubmit}>
                        <Button type="submit" onClick={suggestMessages} disabled={isSuggestingMessages}>
                            { isSuggestingMessages ? (<><Loader2 className="animate-spin w-5 h-5 mr-2"/>Suggesting...</>) : ("Suggest Messages") }
                        </Button>
                        </form>
                        <h1 className="mt-3 pl-1">Click on below messages to copy to the message board</h1>
                    </div>
                    <div className="flex flex-col justify-evenly items-center w-4/5 rounded-md h-auto border-solid border-2">
                        <h1 className="text-black font-semibold text-lg w-[95%] text-left mt-3 mb-3">Messages</h1>
                        {
                            completion.length > 0 && completion.split("||").map((value, index) =>  {
                                return (
                                    
                                    <div key={index} onClick={copyToTextArea} className="hover:bg-slate-100 hover:cursor-pointer w-[95%] border h-[40px] rounded-md mb-10 text-center py-2 px-3 font-normal truncate">{value}</div>
                                    
                                );
                            })
                        }
                        {/* <div onClick={copyToTextArea} className="hover:cursor-pointer w-[95%] border h-[40px] rounded-md mb-10 text-center py-2 px-3 font-normal truncate">{completion}</div>
                        <div className="w-[95%] border h-[40px] rounded-md mb-10"></div>
                        <div className="w-[95%] border h-[40px] rounded-md mb-10"></div> */}
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-normal my-5">Get Your Message Board</h1>
                        <Button className="mb-5" onClick={() => router.push("/sign-up")}>Create Your Account</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PublicProfilePage;