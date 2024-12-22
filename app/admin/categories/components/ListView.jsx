"use client";

import { useCategories } from "@/lib/firestore/categories/read";
import { CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@nextui-org/react";
import { deleteCategory } from "@/lib/firestore/categories/write";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ListView() {
  const { data: categories, error, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col gap-3 px-5 rounded-xl flex-1">
      <h1 className="text-xl">Categories</h1>
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="border-y font-semibold bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="border-y font-semibold bg-white px-3 py-2">Image</th>
            <th className="border-y font-semibold bg-white px-3 py-2 text-center">
              Name
            </th>
            <th className="border-y font-semibold bg-white px-3 py-2 border-r rounded-r-lg">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((item, index) => {
            return <Row index={index} item={item} key={item?.id} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

function Row({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const handleUpdate = () => {
    router.push(`/admin/categories?id=${item.id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are your sure?")) return;
    setIsDeleting(true);
    try {
      await deleteCategory({ id: item?.id });
      toast.success("Sucessfully deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsDeleting(false);
  };
  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex justify-center">
          <img className="h-10 w-10 object-cover" src={item?.imageURL} alt="" />
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 text-center">{item.name}</td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex gap-2 items-center justify-center">
          <Button
            onClick={handleUpdate}
            isDisabled={isDeleting}
            isIconOnly
            size="sm"
          >
            <Edit2 size={13} />
          </Button>
          <Button
            onClick={handleDelete}
            isLoading={isDeleting}
            isDisabled={isDeleting}
            isIconOnly
            size="sm"
            color="danger"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </td>
    </tr>
  );
}
