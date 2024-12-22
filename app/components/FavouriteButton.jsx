"use client";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateFavourite } from "@/lib/firestore/user/write";
import { light } from "@mui/material/styles/createPalette";
import { Button } from "@nextui-org/react";
import { Heart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter } from "next/navigation";

export default function FavouriteButton({ productId }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleClick = async () => {
    try {
      if (!user?.uid) {
        router.push("/login");
        throw new Error("Please Login first");
      }
      if (data?.favorites?.includes(productId)) {
        const newList = data?.favorites?.filter((item) => item != productId);
        await updateFavourite({ list: newList, uid: user?.uid });
      } else {
        await updateFavourite({
          list: [...(data?.favorites ?? []), productId],
          uid: user?.uid,
        });
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };
  const isLiked = data?.favorites?.includes(productId);

  return (
    <Button
      isLoading={isLoading}
      isDisabled={isLoading}
      onClick={handleClick}
      variant="light"
      color="danger"
      className="rounded-full"
      isIconOnly
      size="sm"
    >
      {!isLiked && <FavoriteBorderOutlinedIcon fontSize="small" />}
      {isLiked && <FavoriteIcon fontSize="small" />}
    </Button>
  );
}
