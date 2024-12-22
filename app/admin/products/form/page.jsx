"use client";

import { Button } from "@nextui-org/react";
import BasicDetails from "./components/BasicDetails";
import Description from "./components/Description";
import Images from "./components/Images";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createNewProduct,
  updateProduct,
} from "@/lib/firestore/products/write";
import { useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/firestore/products/read_server";
import { useRouter } from "next/navigation";

export default function Page() {
  // Corrected the component name to PascalCase
  const [data, setData] = useState(null);
  const [featureImage, setFeatureImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await getProduct({ id: id });
      if (!res) {
        throw new Error("Product not found");
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
    setData((prevData) => ({
      ...(prevData ?? {}),
      [key]: value,
    }));
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createNewProduct({
        data: data,
        featureImage: featureImage,
        imageList: imageList,
      });
      setData(null);
      setFeatureImage(null);
      setImageList([]);
      toast.success("Product is successfully created");
      router.push("/admin/products");
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateProduct({
        id: id,
        data: data,
        featureImage: featureImage,
        imageList: imageList,
      });
      setData(null);
      setFeatureImage(null);
      setImageList([]);
      toast.success("Product is successfully updated");
      router.push("/admin/products");
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (id) {
          handleUpdate();
        } else {
          handleCreate();
        }
      }}
      className="p-5 flex flex-col gap-4"
    >
      <div className="flex justify-between items-center md:px-4">
        <h1 className="text-xl font-semibold">
          {id ? "Update Product" : "Create New Product"}
        </h1>
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          type="submit"
          color="primary"
        >
          {id ? "Update" : "Create"}
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <BasicDetails data={data} handleData={handleData} />
        <div className="flex-1 flex flex-col gap-5">
          <Images
            data={data}
            featureImage={featureImage}
            setFeatureImage={setFeatureImage}
            imageList={imageList}
            setImageList={setImageList}
          />
          <Description data={data} handleData={handleData} />
        </div>
      </div>
    </form>
  );
}
