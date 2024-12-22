"use client";

import { useProducts } from "@/lib/firestore/products/read";
import { CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/firestore/products/write";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);

  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);

  const {
    data: products,
    error,
    isLoading,
    lastSnapDoc,
  } = useProducts({
    pageLimit: pageLimit,
    lastSnapDoc:
      lastSnapDocList?.length === 0
        ? null
        : lastSnapDocList[lastSnapDocList?.length - 1],
  });

  const handleNextPage = () => {
    let newStack = [...lastSnapDocList];
    newStack.push(lastSnapDoc);
    setLastSnapDocList(newStack);
  };
  const handlePrevPage = () => {
    let newStack = [...lastSnapDocList];
    newStack.pop();
    setLastSnapDocList(newStack);
  };

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
    <div className="flex flex-col gap-3 px-5 rounded-xl flex-1 w-full overflow-x-auto">
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="border-y font-semibold bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="border-y font-semibold bg-white px-3 py-2">Image</th>
            <th className="border-y font-semibold bg-white px-3 py-2 text-center">
              Title
            </th>
            <th className="border-y font-semibold bg-white px-3 py-2 text-center">
              Price
            </th>
            <th className="border-y font-semibold bg-white px-3 py-2 text-center">
              Stock
            </th>
            <th className="border-y font-semibold bg-white px-3 py-2 text-center">
              Orders
            </th>
            <th className="border-y font-semibold bg-white px-3 py-2 text-center">
              Status
            </th>
            <th className="border-y font-semibold bg-white px-3 py-2 border-r rounded-r-lg">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products?.map((item, index) => {
            return (
              <Row
                index={index + lastSnapDocList?.length * pageLimit}
                item={item}
                key={item?.id}
              />
            );
          })}
        </tbody>
      </table>
      {/* <div className="flex justify-between text-sm py-3">
        <Button
          isDisabled={isLoading || lastSnapDocList?.length === 0}
          onClick={handlePrevPage}
          size="sm"
          variant="bordered"
        >
          Previous
        </Button>
        <select
          value={pageLimit}
          onChange={(e) => setPageLimit(e.target.value)}
          className="px-5 rounded-xl outline-none"
          name="perpage"
          id="perpage"
        >
          <option value={3}>3 Items</option>
          <option value={5}>5 Items</option>
          <option value={10}>10 Items</option>
          <option value={20}>20 Items</option>
          <option value={100}>100 Items</option>
        </select>
        <Button
          isDisabled={isLoading || products?.length < pageLimit}
          onClick={handleNextPage}
          size="sm"
          variant="bordered"
        >
          Next
        </Button>
      </div> */}
      <div className="flex justify-between text-sm py-3 sticky left-0">
        <Button
          isDisabled={isLoading || lastSnapDocList?.length === 0}
          onClick={handlePrevPage}
          size="sm"
          variant="bordered"
        >
          Previous
        </Button>
        <select
          value={pageLimit}
          onChange={(e) => setPageLimit(e.target.value)}
          className="px-5 rounded-xl outline-none"
          name="perpage"
          id="perpage"
        >
          <option value={3}>3 Items</option>
          <option value={5}>5 Items</option>
          <option value={10}>10 Items</option>
          <option value={20}>20 Items</option>
          <option value={100}>100 Items</option>
        </select>
        <Button
          isDisabled={
            isLoading || products?.length < pageLimit || !lastSnapDoc // Check if the last page is reached
          }
          onClick={handleNextPage}
          size="sm"
          variant="bordered"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function Row({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const handleUpdate = () => {
    router.push(`/admin/products/form?id=${item.id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are your sure?")) return;
    setIsDeleting(true);
    try {
      await deleteProduct({ id: item?.id });
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
          <img
            className="h-10 w-10 object-cover"
            src={item?.featureImageURL}
            alt=""
          />
        </div>
      </td>

      <td className="border-y bg-white px-3 py-2 text-center whitespace-nowrap">
        {item?.title}{" "}
        {item?.isFeatured === true && (
          <span className="ml-2 bg-gradient-to-tr from-blue-500 to-indigo-400 text-white text-[10px] rounded-full px-3 py-1">
            Featured
          </span>
        )}
      </td>
      <td className="border-y bg-white px-3 py-2 text-center whitespace-nowrap">
        {item?.salePrice < item?.price && (
          <span className="text-xs text-gray-500 line-through">
            ₹{item?.price}
          </span>
        )}{" "}
        ₹{item?.salePrice}
      </td>
      <td className="border-y bg-white px-3 py-2 text-center">{item?.stock}</td>
      <td className="border-y bg-white px-3 py-2 text-center">
        {item?.orders ?? 0}
      </td>
      <td className="border-y bg-white px-3 py-2 text-center">
        <div className="flex justify-center">
          {item?.stock - (item?.orders ?? 0) >= 0 && (
            <div className="px-2 py-1 text-xs text-green-800 font-bold bg-green-200 rounded-md">
              Available
            </div>
          )}
        </div>
        <div className="flex justify-center">
          {item?.stock - (item?.orders ?? 0) <= 0 && (
            <div className="px-2 py-1 text-xs text-red-800 bg-red-200 font-bold rounded-md">
              Out of Stock
            </div>
          )}
        </div>
      </td>

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
