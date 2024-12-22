"use client";

import { Button } from "@nextui-org/react";
import { Heart } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";
// import FavoriteButton from "./FavoriteButton";
// import AuthContextProvider from "@/contexts/AuthContext";
// import AddToCartButton from "./AddToCartButton";

export default function Brands({ brands }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
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
  if (brands.length === 0) {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-8 overflow-hidden p-10">
      <Slider {...settings}>
        {(brands?.length <= 2
          ? [...brands, ...brands, ...brands]
          : brands
        )?.map((brand) => {
          return (
            <div className="px-2">
              <div className="flex flex-col gap-2 items-center justify-center">
                <div className="h-20 rounded-lg md:p-5 p-2 border overflow-hidden">
                  <img
                    src={brand?.imageURL}
                    className="h-full w-full object-cover"
                    alt=""
                  />
                </div>
                <h1 className="font-semibold">{brand?.name}</h1>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
