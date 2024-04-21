import Image from "next/image";
import PlayersPage from "./players";
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
          <link rel="icon" href="/favicon.ico" /> 
      </Head>
      <PlayersPage/>
    </>
  );
}
