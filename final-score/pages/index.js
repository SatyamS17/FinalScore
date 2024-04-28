"use client";
import Navbar from './navbar';


export default function Home() {
  return (
    <>
    
    <Navbar />
    <div className='container mx-auto items-center justify-center flex mt-12'>
      <h1 class="text-5xl">Welcome to <span class="inline-block bg-gradient-to-r from-blue-500 to-orange-400 text-transparent bg-clip-text font-bold">Final Score!</span></h1>
    </div>
    </>
  );
}
