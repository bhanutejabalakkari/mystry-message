import OpenAI from 'openai';
import { google } from "@ai-sdk/google"
import { streamText } from 'ai';
import { NextResponse } from 'next/server';



export const runtime = 'edge';

export async function POST(req: Request) {
    console.log("In Suggesting Messages Post Route");
    
    try {
        const basePrompt = "Give me new suggestions every time , Create a list of three open-ended and engaging questions for a social messaging platform. Each question should be separated by '||'. These questions should be different from previous ones. Here is a random seed for generating different questions: ";

        const randomSeed = Math.random().toString(36).substring(7); // Generate a random seed

        const prompt = basePrompt + randomSeed;

        const result = await streamText({
            model: google('gemini-1.0-pro'),
            prompt: prompt,

        });


        return result.toDataStreamResponse();

    
    
    
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
        
            const { name, status, headers, message } = error;
            return NextResponse.json({ name, status, headers, message }, { status });
        } else {
        
            console.log("Error :: SUGGEST_MESSAGES :: POST");
            console.log(error);
            return Response.json({
                success: false,
                message: "Error while suggesting messages"
            }, { status: 400 })

        
        }
    }
}