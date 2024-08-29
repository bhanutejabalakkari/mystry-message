'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { usePathname } from 'next/navigation';

type ButtonDisplayType = {
  "/sign-in": {
    redirectUrl: string;
    name: string;
  };
  "/sign-up": {
    redirectUrl: string;
    name: string;
  };
  "/": string;
};

function Navbar() {
  const { data: session } = useSession();
  const pathname: string = usePathname(); 
  const user : User = session?.user as User;
  const buttonDisplay: ButtonDisplayType  = {
    "/sign-in" : {
      redirectUrl: "/sign-up",
      name: "Sign Up"
    },
    "/sign-up": {
      redirectUrl: "/sign-in",
      name: "Login"
    },
    "/": "Login"
  }
  

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user.username || user.email}
            </span>
            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
          </>
        ) : (
          <Link href={buttonDisplay[`${pathname}`].redirectUrl}>
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>{buttonDisplay[`${pathname}`] != undefined ? (buttonDisplay[`${pathname}`].name) : (buttonDisplay['/sign-in'].name) }</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;