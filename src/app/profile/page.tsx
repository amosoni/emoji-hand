"use client";
import PageContainer from "../components/PageContainer";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
// import { useTranslation } from "react-i18next";
// import { useSession } from "next-auth/react";
// import { api } from "~/trpc/react";

export default function ProfilePage() {
  // const { t } = useTranslation();
  // const { data: session } = useSession();
  // const user = session?.user;
  // const { data: profile } = api.profile.getProfile.useQuery(undefined, { enabled: !!user });
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-500">
      <NavBar />
      <div className="max-w-3xl mx-auto p-8 mt-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p className="mb-4">This is the profile page. (i18n & session disabled for build fix)</p>
      </div>
      <Footer />
    </div>
  );
} 