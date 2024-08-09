"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b-2 border-white py-2 px-4 rounded-md">
      <div className="flex items-center justify-between w-full">
        <Link href="/" className="w-[2rem] lg:w-[4rem] h-auto">
          <Image src="/logo.png" alt="Logo" className="mr-8 w-full" width={60} height={60} />
        </Link>
        <div className="flex items-center space-x-4 w-full ml-8">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/learn" className="hover:text-gray-300">
            Learn
          </Link>
          <Link href="/teach" className="hover:text-gray-300">
            Teach
          </Link>
        </div>
        <Link href="/#mailing-list" className="justify-end w-[12rem]">
          Join Mailing List
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
