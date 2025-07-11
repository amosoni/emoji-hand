import Link from "next/link";
import HomeHero from '../components/HomeHero';
import Translator from "../../components/Translator";
import EmojiStats from "../../components/EmojiStats";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { LatestPost } from "@/app/_components/post";
import Head from "next/head";
import ShareFooter from "../../components/ShareFooter";
import HomeClient from '../components/HomeClient';

export default async function Home() {
  const hello = "Hello from Next.js!";

  return <HomeClient hello={hello} />;
}
