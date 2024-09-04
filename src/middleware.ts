import { NextResponse, NextRequest } from 'next/server'
export { default } from "next-auth/middleware" 
import { getToken } from 'next-auth/jwt'


export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ],
}

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    console.log("Middleware called baby ")
    console.log("The URL Pathname in Middleware --> ", url.pathname);
    

    if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify')  ||
        url.pathname.startsWith('/')
    )) {
        console.log("The Token is there");
        if(url.pathname.startsWith('/dashboard')) return NextResponse.next();
        
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
        console.log("The error middleware");
        
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    console.log("Token is not there");
    

    return NextResponse.next();
}
 
