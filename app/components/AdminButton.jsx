"use client";

import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import Link from "next/link";

export default function AdminButton() {
  const { user } = useAuth();
  const { data } = useAdmin({ email: user?.email });
  if (!data) {
    return <></>;
  }
  return (
    <Link href={"/admin"}>
      <button className="px-4 py-1 bg-blue-50 rounded-full hover:bg-blue-200 font-semibold text-blue-600">
        Admin
      </button>
    </Link>
  );
}
