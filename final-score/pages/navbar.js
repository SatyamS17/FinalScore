"use client"
import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import basketball from '../public/basketball.webp';

const Navbar = () => {
  return (
    <div className="flex justify-between bg-white mt-5 mx-14">
        <div className="flex gap-3 ">
            <Image
            src={basketball} 
            alt="basketball"
            width={50} 
            
            
            />
            <h1 className="text-3xl font-bold mt-2"><Link href="/">Final Score</Link></h1>
        </div>
        <div className="flex gap-5">
            
            <div className="flex mb-2 justify-start items-center gap-4 hover:bg-gray-900 px-4 py-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                <Link href="/players">Players</Link>
                </h3>
            </div>
            <div className="flex mb-2 justify-start items-center gap-4 hover:bg-gray-900 px-4 py-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                <Link href="/login">Login</Link>
                </h3>
            </div>
        </div>
        
    </div>
  );
};

export default Navbar;
