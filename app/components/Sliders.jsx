"use client";

import { Button } from "@nextui-org/react";
import { Heart } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";
import FavouriteButton from "./FavouriteButton";
import AuthContextProvider from "@/context/AuthContext";
import AddToCartButton from "./AddToCartButton";

export default function FeaturedProductSlider({ featuredProducts }) {
  // Slider settings
  var settings = {
    dots: true, // Show navigation dots
    infinite: true, // Enable infinite looping
    speed: 2000, // Transition speed in milliseconds
    slidesToShow: 1, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Time between slides (in milliseconds, here 5 seconds)
  };

  return (
    <div className="overflow-hidden">
      <Slider {...settings}>
        {featuredProducts?.map((product) => {
          return (
            <div key={product?.id}>
              <div
                className="
              flex flex-col-reverse md:flex-row md:gap-4 
              bg-[#f8f8f8] p-7 md:p-10 md:px-24 md:py-20"
              >
                {/* Text Content */}
                <div className="flex-1 flex flex-col gap-6 md:gap-10 justify-center">
                  <h2 className="text-gray-500 text-sm md:text-xl">
                    OUR BESTSELLERS
                  </h2>
                  <div className="flex flex-col gap-3">
                    <Link href={`/products/${product?.id}`}>
                      <h1 className="text-lg md:text-4xl font-semibold">
                        {product?.title}
                      </h1>
                    </Link>
                    <h1 className="text-gray-600 text-sm max-w-96 line-clamp-2">
                      {product?.shortDescription}
                    </h1>
                  </div>
                  <AuthContextProvider>
                    <div className="flex gap-3 items-center">
                      <Link
                        href={`/checkout?type=buynow&productId=${product?.id}`}
                      >
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm">
                          Buy Now
                        </button>
                      </Link>
                      <AddToCartButton productId={product?.id} type={"large"} />
                      <FavouriteButton productId={product?.id} />
                    </div>
                  </AuthContextProvider>
                </div>

                {/* Image */}
                <div className="flex justify-center mb-6 md:mb-0 sm:order-first md:order-last rounded-lg overflow-hidden">
                  <Link href={`/products/${product?.id}`}>
                    <img
                      className="md:h-[23rem] h-[15rem]"
                      src={product?.featureImageURL}
                      alt={product?.title || "Product Image"}
                    />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
