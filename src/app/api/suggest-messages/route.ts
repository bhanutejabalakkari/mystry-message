import OpenAI from 'openai';
import { google } from "@ai-sdk/google"
import { streamText } from 'ai';
import { NextResponse } from 'next/server';



export const runtime = 'edge';

export async function POST(req: Request) {
    console.log("In Suggesting Messages Post Route");
    
    try {
        
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        const result = await streamText({
            model: google('gemini-1.0-pro'),
            prompt: prompt,
            temperature: 0.7
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