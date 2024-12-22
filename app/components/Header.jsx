import AuthContextProvider from "@/context/AuthContext";
import { Heart, Search, ShoppingCart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import LogoutButton from "./LogoutButton";
import HeaderClientButtons from "./HeaderClientButtons";
import AdminButton from "./AdminButton";

function Header() {
  const menuList = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "About Us",
      link: "/about-us",
    },
    {
      name: "Contact Us",
      link: "/contact-us",
    },
  ];
  return (
    <nav className="sticky top-0 z-50 bg-white bg-opacity-65 backdrop-blur-2xl py-3 px-1 md:py-2 md:px-12 border-b flex items-center justify-between">
      <Link href={"/"}>
        <img className="h-4 md:h-7 px-3" src="/logo.png" alt="Logo" />
      </Link>
      <div className="hidden md:flex gap-2 items-center font-semibold w-[450px] justify-center">
        {menuList?.map((item) => {
          return (
            <Link href={item?.link}>
              <button className="text-sm px-4 py-2 rounded-lg hover:bg-gray-50">
                {item?.name}
              </button>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center">
        <AuthContextProvider>
          <AdminButton />
        </AuthContextProvider>
        <AuthContextProvider>
          <HeaderClientButtons />
        </AuthContextProvider>
        <Link href={"/account"}>
          <button
            title="My Account"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <UserCircle2 size={14} />
          </button>
        </Link>
        <AuthContextProvider>
          <LogoutButton />
        </AuthContextProvider>
      </div>
    </nav>
  );
}

export default Header;
