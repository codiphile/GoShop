"use client";

import { getCollection } from "@/lib/firestore/collections/read_server";
import {
  createNewCollection,
  updateCollection,
} from "@/lib/firestore/collections/write";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProduct, useProducts } from "@/lib/firestore/products/read";
import { X } from "lucide-react";

export default function Form() {
  const [data, setData] = useState(null);

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: products } = useProducts({ pageLimit: 200 });

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  // Defining functionality
  const fetchData = async () => {
    try {
      const res = await getCollection({ id: id });
      if (!res) {
        toast.error("Collection not found");
      } else {
        setData(res);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key, value) => {
    setData((preData) => {
      return { ...(preData ?? {}), [key]: value };
    });
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createNewCollection({ data: data, image: image });
      toast.success("Successfully Created");

      // Reset the form state
      setData(null);
      setImage(null);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateCollection({ data: data, image: image });
      toast.success("Successfully Updated");

      // Reset the form state
      setData(null);
      setImage(null);
      router.push(`/admin/collections`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl p-5 w-full md:w-[400px]">
      <h1 className="font-semibold">{id ? "Update" : "Create"} Collections</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (id) {
            handleUpdate();
          } else {
            handleCreate();
          }
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="collection-image" className="text-gray-500 text-sm">
            Image <span className="text-red-600">*</span>
          </label>
          {image && (
            <div className="flex justify-center items-center p-3">
              <img className="h-20" src={URL.createObjectURL(image)} alt="" />
            </div>
          )}
          <input
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setImage(e.target.files[0]);
              }
            }}
            id="collection-image"
            name="collection-image"
            type="file"
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="title-name" className="text-gray-500 text-sm">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            id="title-name"
            name="title-name"
            type="text"
            value={data?.title ?? ""}
            onChange={(e) => {
              handleData("title", e.target.value);
            }}
            placeholder="Enter title"
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="collection-subTitle"
            className="text-gray-500 text-sm"
          >
            Subtitle <span className="text-red-600">*</span>
          </label>
          <input
            id="collection-subTitle"
            name="collection-subTitle"
            type="text"
            placeholder="Enter subtitle"
            value={data?.subtitle ?? ""}
            onChange={(e) => {
              handleData("subtitle", e.target.value);
            }}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {data?.products?.map((productId) => {
            return (
              <ProductCard
                productId={productId}
                key={productId}
                setData={setData}
              />
            );
          })}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="selectProduct" className="text-gray-500 text-sm">
            Select Product <span className="text-red-600">*</span>
          </label>
          <select
            id="collection-products"
            name="collection-products"
            type="text"
            onChange={(e) => {
              setData((prevData) => {
                let list = [...(prevData?.products ?? [])];
                list.push(e.target.value);
                return {
                  ...prevData,
                  products: list,
                };
              });
            }}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          >
            <option value="">Select Product</option>
            {products?.map((item) => {
              return (
                <option
                  disabled={data?.products?.includes(item?.id)}
                  value={item?.id}
                >
                  {item?.title}
                </option>
              );
            })}
          </select>
        </div>

        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          type="submit"
          className="mt-3"
        >
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  );
}

function ProductCard({ productId, setData }) {
  const { data: product } = useProduct({ productId: productId });
  return (
    <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm flex gap-3 items-center">
      <h2>{product?.title}</h2>
      <button
        onClick={(e) => {
          e.preventDefault();
          setData((prevData) => {
            let list = [...prevData?.products];
            list = list?.filter((item) => item !== productId);
            return {
              ...prevData,
              products: list,
            };
          });
        }}
      >
        <X size={12} />
      </button>
    </div>
  );
}
