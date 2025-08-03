import Link from "next/link";
import HomeHero from '../components/HomeHero';
import Translator from "../../components/Translator";
import EmojiStats from "../../components/EmojiStats";

import { LatestPost } from "@/app/_components/post";
import Head from "next/head";

import HomeClient from '../components/HomeClient';

export default async function Home() {
  const hello = "Hello from Next.js!";

  return <HomeClient hello={hello} />;
}
