"use client";

import Link from "next/link";
import {
  Cat,
  Layers2,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  PackageOpen,
  ShieldCheck,
  ShoppingCart,
  Star,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function Sidebar() {
  const menuList = [
    {
      name: "Dashboard",
      link: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Products",
      link: "/admin/products",
      icon: <PackageOpen className="h-5 w-5" />,
    },
    {
      name: "Categories",
      link: "/admin/categories",
      icon: <Layers2 className="h-5 w-5" />,
    },
    {
      name: "Brands",
      link: "/admin/brands",
      icon: <Cat className="h-5 w-5" />,
    },
    {
      name: "Orders",
      link: "/admin/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Customers",
      link: "/admin/customers",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Reviews",
      link: "/admin/reviews",
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: "Collections",
      link: "/admin/collections",
      icon: <LibraryBig className="h-5 w-5" />,
    },
    {
      name: "Admins",
      link: "/admin/admins",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
  ];

  return (
    <section className="sticky top-0 flex flex-col gap-10  bg-white border-r px-5 py-3 h-screen overflow-hidden md:w-[260px]">
      <div className="flex justify-center py-4">
        <Link href={"/"}>
          <img className="h-[80px] md:h-[100px]" src="/logo3.png" alt="" />
        </Link>
      </div>
      <ul className="flex-1 h-full overflow-auto flex flex-col gap-4">
        {menuList?.map((item, key) => {
          return <Tab item={item} key={key} />;
        })}
      </ul>
      <div className="flex justify-center">
        <button
          className="flex gap-2 items-center px-3 py-2 hover:bg-indigo-100 rounded-xl w-full justify-center ease-soft-spring duration-400 transition-all"
          onClick={async () => {
            try {
              await toast.promise(signOut(auth), {
                error: (e) => e?.message,
                loading: "Loading ..",
                success: "Successfully Logged Out",
              });
            } catch (error) {
              toast.error(error?.message);
            }
          }}
        >
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>
    </section>
  );
}

function Tab({ item }) {
  const pathname = usePathname();
  const isSelected = pathname === item?.link;

  return (
    <Link href={item?.link}>
      <li
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ease-soft-spring transition-all duration-300 ${
          isSelected ? "bg-[#879fff] text-white" : "bg-white text-black"
        }`}
      >
        {item?.icon}
        {item?.name}
      </li>
    </Link>
  );
}
