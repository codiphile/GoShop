"use client";

import { Button } from "@nextui-org/react";
import { Heart } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";
import { motion } from "framer-motion";

export default function Collections({ collections }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
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
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (collections.length === 0) {
    return <></>;
  }

  return (
    <div className=" py-10 px-0 border">
      <Slider {...settings}>
        {(collections?.length <= 2
          ? [...collections, ...collections, ...collections]
          : collections
        )?.map((collection) => {
          return (
            <div className="px-5" key={collection?.id}>
              {/* Wrap the collection card with motion.div for animation */}
              <motion.div
                className="flex gap-3 md:p-5 p-3 w-full md:max-h-[200px]  bg-gradient-to-tr to-[#d9e2f1] from-[#cce7f5] rounded-xl justify-between"
                whileHover={{ scale: 1.02 }} // Scale up on hover
                transition={{ duration: 0.3 }} // Smooth transition
              >
                <div className="flex flex-col md:gap-2 gap-4 max-w-[60%] justify-between">
                  <div className="flex flex-col pt-2">
                    <h1 className="md:text-xl text-lg font-semibold">
                      {collection?.title}
                    </h1>
                    <h1 className="text-gray-600 text-sm md:max-w-96 max-w-[65%] line-clamp-2">
                      {collection?.subtitle}
                    </h1>
                  </div>
                  <div className="flex items-center mb-2">
                    <Link href={`/collections/${collection?.id}`}>
                      <button className="bg-blue-500 text-white px-4 py-2  text-sm rounded-lg">
                        SHOP NOW
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="md:max-w-[50%] max-w-[35%] flex justify-end items-center">
                  <img
                    className="md:h-[80%] "
                    src={collection?.imageURL}
                    alt=""
                  />
                </div>
              </motion.div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
