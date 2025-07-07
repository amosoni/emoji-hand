"use client";
import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-500">
      <NavBar />
      <div className="max-w-3xl mx-auto p-8 mt-8">
        <h1 className="text-3xl font-bold mb-4">{t("privacy.title")}</h1>
        <p className="mb-4">{t("privacy.intro")}</p>
        <h2 className="text-xl font-bold mt-6 mb-2">{t("privacy.section1")}</h2>
        <ul className="list-disc pl-6 mb-4">
          {Array.isArray(t("privacy.list1", { returnObjects: true }))
            ? (t("privacy.list1", { returnObjects: true }) as string[]).map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))
            : <li>{String(t("privacy.list1", { returnObjects: true }) ?? "")}</li>
          }
        </ul>
        <h2 className="text-xl font-bold mt-6 mb-2">{t("privacy.section2")}</h2>
        <ul className="list-disc pl-6 mb-4">
          {Array.isArray(t("privacy.list2", { returnObjects: true }))
            ? (t("privacy.list2", { returnObjects: true }) as string[]).map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))
            : <li>{String(t("privacy.list2", { returnObjects: true }) ?? "")}</li>
          }
        </ul>
        <h2 className="text-xl font-bold mt-6 mb-2">{t("privacy.section3")}</h2>
        <ul className="list-disc pl-6 mb-4">
          {Array.isArray(t("privacy.list3", { returnObjects: true }))
            ? (t("privacy.list3", { returnObjects: true }) as string[]).map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))
            : <li>{String(t("privacy.list3", { returnObjects: true }) ?? "")}</li>
          }
        </ul>
        <h2 className="text-xl font-bold mt-6 mb-2">{t("privacy.section4")}</h2>
        <p className="mb-4">{t("privacy.security")}</p>
        <h2 className="text-xl font-bold mt-6 mb-2">{t("privacy.section5")}</h2>
        <ul className="list-disc pl-6 mb-4">
          {Array.isArray(t("privacy.list5", { returnObjects: true }))
            ? (t("privacy.list5", { returnObjects: true }) as string[]).map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))
            : <li>{String(t("privacy.list5", { returnObjects: true }) ?? "")}</li>
          }
        </ul>
        <h2 className="text-xl font-bold mt-6 mb-2">{t("privacy.section6")}</h2>
        <p className="mb-4">{t("privacy.contact")}</p>
        <h2 className="text-xl font-bold mt-6 mb-2">{t("privacy.section7")}</h2>
        <p>{t("privacy.change")}</p>
      </div>
      <Footer />
    </div>
  );
} 