import { ProductCard } from "@/app/components/Products";
import { getCategory } from "@/lib/firestore/categories/read_server";
import { getProductsByCategory } from "@/lib/firestore/products/read_server";

export default async function Page({ params }) {
  const { categoryId } = params;
  const category = await getCategory({ id: categoryId });
  const products = await getProductsByCategory({ categoryId: categoryId });
  return (
    <main
      className="flex justify-center p-5 md:px-10
    md:py-5
    w-full min-h-screen"
    >
      <div className="max-w-[900px] p-5 flex flex-col gap-6">
        <h1 className="text-center font-semibold text-2xl md:text-4xl ">
          {category.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-center items-center justify-self-center  gap-4 md:gap-5 ">
          {products?.map((item) => {
            return <ProductCard product={item} key={item?.id} />;
          })}
        </div>
      </div>
    </main>
  );
}
