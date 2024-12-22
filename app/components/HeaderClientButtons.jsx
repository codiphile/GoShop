"use client";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { Badge } from "@nextui-org/react";
import { Heart, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
export default function HeaderClientButtons() {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });

  return (
    <div className="flex items-center">
      <Link href={"/search"}>
        <button
          title="Search Products"
          className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
        >
          <Search size={14} />
        </button>
      </Link>
      <Link href={"/favourites"}>
        <Badge
          variant="solid"
          size="sm"
          className="text-white bg-red-500 text-[8px]"
          content={data?.favorites?.length ?? 0}
        >
          <button
            title="My Favourites"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <Heart size={14} />
          </button>
        </Badge>
      </Link>
      <Link href={"/cart"}>
        <Badge
          variant="solid"
          size="sm"
          className="text-white bg-red-500 text-[8px]"
          content={data?.carts?.length ?? 0}
        >
          <button
            title="My Cart"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <ShoppingCart size={14} />
          </button>
        </Badge>
      </Link>
    </div>
  );
}
