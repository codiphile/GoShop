"use client";

import AuthContextProvider, { useAuth } from "@/context/AuthContext";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { CircularProgress } from "@nextui-org/react";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <AuthContextProvider>
        <div className="flex-grow">
          <UserChecking>
            <section className="min-h-screen">{children}</section>
          </UserChecking>
        </div>
      </AuthContextProvider>
      <Footer />
    </main>
  );
}

function UserChecking({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-96 w-full flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-[500px] w-full flex flex-col gap-3 justify-center items-center">
        <h1 className="md:text-sm text-lg text-gray-500 text-center">
          You are not logged in!!
        </h1>
        <Link href={"/login"}>
          <button className="text-white bg-blue-500 px-4 py-2 rounded-xl">
            Login
          </button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
