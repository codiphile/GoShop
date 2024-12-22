"use client";

import { useProducts } from "@/lib/firestore/products/read";
import { Avatar, CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/firestore/products/write";
import { useAllOrders, useAllorders } from "@/lib/firestore/orders/read";
import { useUser } from "@/lib/firestore/user/read";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);

  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);

  const {
    data: orders,
    error,
    isLoading,
    lastSnapDoc,
  } = useAllOrders({
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
            <th className="border-y font-semibold bg-white px-3 py-2 text-center">
              Customer
            </th>
            <th className="border-y font-semibold bg-white px-3 py-2 text-center">
              Total Price
            </th>
            <th className="border-y font-semibold bg-white px-3 py-2 text-center">
              Total Products
            </th>
            <th className="border-y font-semibold bg-white px-3 py-2 text-center">
              Payment Mode
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
          {orders?.map((item, index) => {
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
          isDisabled={isLoading || orders?.length === 0}
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
  const totalAmount = item?.checkout?.line_items?.reduce((prev, curr) => {
    return prev + (curr?.price_data?.unit_amount / 100) * curr?.quantity;
  }, 0);
  const { data: user } = useUser({ uid: item?.uid });

  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2 whitespace-nowrap">
        <div className="flex gap-2 items-center justify-center">
          <Avatar size="sm" src={user?.photoURL} />
          <div className="flex flex-col">
            <h1> {user?.displayName}</h1>
            <h1 className="text-xs text-gray-600"> {user?.email}</h1>
          </div>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-4  whitespace-nowrap flex justify-center items-center">
        ₹ {totalAmount}
      </td>
      <td className="border-y bg-white px-3 py-2 text-center">
        {item?.checkout?.line_items?.length}
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex justify-center">
          <h3 className="bg-blue-100 text-blue-500 text-xs rounded-lg px-2 py-1 uppercase ">
            {item?.paymentMode}
          </h3>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex justify-center">
          <h3 className="bg-green-100 text-green-500 text-xs rounded-lg px-2 py-1 uppercase">
            {item?.status ?? "pending"}
          </h3>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex justify-center">
          <Link href={`/admin/orders/${item?.id}`}>
            <button className="bg-black text-white px-3 py-2 rounded-lg text-xs">
              View
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );
}
