'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type ButtonDisplayType = {
    "sign-in": {
      redirectUrl: string;
      name: string;
    };
    "sign-up": {
      redirectUrl: string;
      name: string;
    };
    "/": {
        redirectUrl: string;
        name: string;
    };
};

function Navbar() {

    const { data: session } = useSession();
    const pathname: string = usePathname(); 
    const user: User = session?.user as User;
    console.log("The Pathname is  --> ", pathname);

    const getURL = (currentPathname: string): { redirectURL : string, name: string } => {
        
        switch(currentPathname) {
            case "sign-in":
                return {
                    redirectURL: "/sign-up",
                    name: "Sign Up"
                }
            case "sign-up":
                return {
                    redirectURL: "/sign-in",
                    name: "Sign In"
                }
            case "/":
                return {
                  redirectURL: "/sign-in",
                  name: "Sign In"
                }
            default: 
                return {
                    redirectURL: "/sign-in",
                    name: `loader`
                }
        }

    }

    const cred = getURL(pathname);


  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Mystry Message
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, { user.username || user.email }
            </span>
            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
          </>
        ) : (
          <Link href={cred.redirectURL}>
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}> {cred.name === "loader" ? (<Loader2 className='h-4 animate-spin'/>) : (cred.name)} </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;