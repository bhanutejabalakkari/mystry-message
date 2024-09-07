'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardFooter,
    CardTitle
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/User";
import { useToast } from "./ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import dayjs from 'dayjs';
  
type MessageCardProps = {
    message: Message;
    onMessageDelete: ( messageId: string ) => void
}

const MessageCard = ( { message, onMessageDelete }: MessageCardProps ) => {

    const { toast } = useToast();

    const handleDeleteConfirm = async () => {
        try {
            
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            toast({
                title: response.data.message
            })
            onMessageDelete(message._id as string);

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast({
                title: errorMessage,
            })
            
        }
        
        
    }

    

  

    

    return (
        <Card className="card-bordered hover:bg-slate-100 overflow-auto">
            <CardHeader>
                <div className="flex items-start justify-between">
                <CardTitle className="max-w-[87%]">{message.content}</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="border rounded-md border-gray-400 w-7 mr-0 hover:bg-slate-300  h-5"><X className="w-full p-1 h-full text-black"/></button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </div>
                <div className="text-sm">
                {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>
        </Card>
      
    );
}



export default MessageCard;