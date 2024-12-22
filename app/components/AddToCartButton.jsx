"use client";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { light } from "@mui/material/styles/createPalette";
import { Button } from "@nextui-org/react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ productId, type }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isAdded = data?.carts?.find((item) => item?.id === productId);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (!user?.uid) {
        router.push("/login");
        throw new Error("Please Logged In First!");
      }
      if (isAdded) {
        const newList = data?.carts?.filter((item) => item?.id != productId);
        await updateCarts({ list: newList, uid: user?.uid });
      } else {
        await updateCarts({
          list: [...(data?.carts ?? []), { id: productId, quantity: 1 }],
          uid: user?.uid,
        });
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  if (type == "large") {
    return (
      <Button
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={handleClick}
        variant="bordered"
        className="text-blue-500 bg-white text-xs md:text-sm"
        color="primary"
        size="sm"
      >
        {!isAdded && <AddShoppingCartIcon className="text-xs" />}
        {isAdded && <ShoppingCartIcon className="text-xs" />}
        {!isAdded && "Add to Cart"}
        {isAdded && "Click to Remove"}
      </Button>
    );
  }
  return (
    <Button
      isLoading={isLoading}
      isDisabled={isLoading}
      onClick={handleClick}
      variant="flat"
      isIconOnly
      size="sm"
    >
      {!isAdded && <AddShoppingCartIcon className="text-xs" />}
      {isAdded && <ShoppingCartIcon className="text-xs" />}
    </Button>
  );
}
