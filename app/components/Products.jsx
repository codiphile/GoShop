"use client";

import { Rating } from "@mui/material";
import { Button } from "@nextui-org/react";
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import FavouriteButton from "./FavouriteButton";
import AuthContextProvider from "@/context/AuthContext";
import AddToCartButton from "./AddToCartButton";
import { motion } from "framer-motion"; // Import motion from Framer Motion
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";
import { Suspense } from "react";
import MyRating from "./MyRating";

export default function ProductGridView({ products }) {
  return (
    <section className="flex w-full justify-center">
      <div className="max-w-[900px] p-5 flex flex-col gap-5">
        <h1 className="text-center font-semibold text-lg">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products?.map((item) => {
            return <ProductCard product={item} key={item?.id} />;
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product }) {
  return (
    // Apply motion.div for animation
    <motion.div
      className="flex flex-col gap-3 border p-4 rounded-lg"
      whileHover={{ scale: 1.05 }} // Scale effect on hover
      transition={{ duration: 0.3 }} // Smooth transition
    >
      <div className="relative">
        <img
          src={product?.featureImageURL}
          className="rounded-lg h-48 object-cover w-full"
          alt={product?.title}
        />
        <div className="absolute top-1 right-1">
          <AuthContextProvider>
            <FavouriteButton productId={product?.id} />
          </AuthContextProvider>
        </div>
      </div>
      <Link href={`/products/${product?.id}`}>
        <h1 className="font-semibold line-clamp-1 text-sm">{product?.title}</h1>
      </Link>
      <div className="">
        <h2 className="text-green-500 text-sm font-semibold">
          ₹{product?.salePrice}
          <span className="line-through text-xs text-gray-600">
            ₹{product?.price}
          </span>
        </h2>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2">
        {product?.shortDescription}
      </p>
      <Suspense>
        <RatingReview product={product} />
      </Suspense>
      {product?.stock <= (product?.orders ?? 0) && (
        <div className="flex">
          <h3 className="text-red-500 rounded-lg text-xs font-semibold">
            Out Of Stock
          </h3>
        </div>
      )}
      <div className="flex items-center gap-3 w-full">
        <div className="w-full bordered">
          <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
            <button className="bg-blue-500 text-white px-4 py-1.5 rounded-xl text-sm w-full">
              Buy Now
            </button>
          </Link>
        </div>
        <AuthContextProvider>
          <AddToCartButton productId={product?.id} />
        </AuthContextProvider>
      </div>
    </motion.div>
  );
}

async function RatingReview({ product }) {
  const counts = await getProductReviewCounts({ productId: product?.id });
  return (
    <div className="flex gap-3 items-center">
      <MyRating value={counts?.averageRating ?? 0} />
      <h1 className="text-xs text-gray-400">
        <span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews}
        )
      </h1>
    </div>
  );
}
