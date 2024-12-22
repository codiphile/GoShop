"use client";

import { Button } from "@nextui-org/react";
import { Heart } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";
// import FavoriteButton from "./FavoriteButton";
// import AuthContextProvider from "@/contexts/AuthContext";
// import AddToCartButton from "./AddToCartButton";

export default function Categories({ categories }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 3000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 10,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  if (categories.length === 0) {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-8 overflow-hidden p-10">
      <div>
        <h1 className="text-lg font-semibold flex w-full justify-center">
          Shop by Category
        </h1>
      </div>
      <Slider {...settings}>
        {(categories?.length <= 2
          ? [...categories, ...categories, ...categories]
          : categories
        )?.map((category) => {
          return (
            <Link href={`categories/${category?.id}`}>
              <div className="px-2">
                <div className="flex flex-col gap-2 items-center justify-center">
                  <div className="h-32 w-32 rounded-full p-5 border overflow-hidden">
                    <img src={category?.imageURL} alt="" />
                  </div>
                  <h1 className="font-semibold">{category?.name}</h1>
                </div>
              </div>
            </Link>
          );
        })}
      </Slider>
    </div>
  );
}
