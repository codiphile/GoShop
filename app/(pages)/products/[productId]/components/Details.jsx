import AddToCartButton from "@/app/components/AddToCartButton";
import FavouriteButton from "@/app/components/FavouriteButton";
import AuthContextProvider from "@/context/AuthContext";
import { getBrand } from "@/lib/firestore/brands/read_server";
import {
  getCategories,
  getCategory,
} from "@/lib/firestore/categories/read_server";
import { Button } from "@nextui-org/react";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function Details({ product }) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex gap-3">
        <Category categoryId={product?.categoryId} />
        <Brand brandId={product?.brandId} />
      </div>
      <h1 className="font-semibold text-xl md:text-4xl ">{product?.title}</h1>
      <h1 className="text-gray-600 text-sm line-clamp-3 md:line-clamp-4">
        {product?.shortDescription}
      </h1>
      <h3 className="text-green-500 font-bold text-lg">
        ₹{product?.salePrice}{" "}
        <span className="line-through text-gray-700 text-sm">
          ₹{product?.price}
        </span>
      </h3>
      <div className="flex items-center gap-4 flex-wrap">
        <AuthContextProvider>
          <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm">
              Buy Now
            </button>
          </Link>
          <AddToCartButton productId={product?.id} type={"large"} />
          <FavouriteButton productId={product?.id} />
        </AuthContextProvider>
      </div>
      <div className="flex flex-col gap-2 py-6">
        <div
          className="text-gray-600"
          dangerouslySetInnerHTML={{ __html: product?.description ?? "" }}
        ></div>
      </div>
    </div>
  );
}

async function Category({ categoryId }) {
  const category = await getCategory({ id: categoryId });
  return (
    <Link href={`/categories/${category.id}`}>
      <div className="flex items-center gap-1 px-3 py-1 rounded-full border">
        <img src={category?.imageURL} className="h-4  " alt="" />
        <h4 className="text-sm font-semibold">{category?.name}</h4>
      </div>
    </Link>
  );
}

async function Brand({ brandId }) {
  const brand = await getBrand({ id: brandId });
  return (
    <div className="flex items-center gap-1 px-3 py-1 rounded-full border">
      <img src={brand?.imageURL} className="h-4 " alt="" />
      <h4 className="text-sm font-semibold">{brand?.name}</h4>
    </div>
  );
}
