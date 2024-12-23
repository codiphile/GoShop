// // import {
// //   getFeaturedProducts,
// //   getProducts,
// // } from "@/lib/firestore/products/read_server";
// // import dynamic from "next/dynamic";
// // const MotionDiv = dynamic(
// //   () => import("framer-motion").then((mod) => mod.motion.div),
// //   { ssr: false }
// // );
// // import Header from "./components/Header";
// // import FeaturedProductSlider from "./components/Sliders";
// // import Collections from "./components/Collections";
// // import { getCollections } from "@/lib/firestore/collections/read_server";
// // import Categories from "./components/Categories";
// // import { getCategories } from "@/lib/firestore/categories/read_server";
// // import ProductGridView from "./components/Products";
// // import CustomerReviews from "./components/CustomerReview";
// // import Brands from "./components/Brands";
// // import { getBrands } from "@/lib/firestore/brands/read_server";
// // import Footer from "./components/Footer";

// // export default async function Home() {
// //   const [featuredProducts, collections, categories, products, brands] =
// //     await Promise.all([
// //       getFeaturedProducts(),
// //       getCollections(),
// //       getCategories(),
// //       getProducts(),
// //       getBrands(),
// //     ]);
// //   return (
// //     <main className=" w-screen h-screen">
// //       <section className="flex flex-col w-screen">
// //         <MotionDiv initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
// //           <Header />
// //         </MotionDiv>
// //         <FeaturedProductSlider featuredProducts={featuredProducts} />
// //         <Collections collections={collections} />
// //         <Categories categories={categories} />
// //         <ProductGridView products={products} />
// //         <CustomerReviews />
// //         <Brands brands={brands} />
// //         <Footer />
// //       </section>
// //     </main>
// //   );
// // }

// import dynamic from "next/dynamic"; // Make sure dynamic is imported

// const MotionDiv = dynamic(
//   () => import("framer-motion").then((mod) => mod.motion.div),
//   { ssr: false }
// );

// import {
//   getFeaturedProducts,
//   getProducts,
// } from "@/lib/firestore/products/read_server";
// import Header from "./components/Header";
// import FeaturedProductSlider from "./components/Sliders";
// import Collections from "./components/Collections";
// import { getCollections } from "@/lib/firestore/collections/read_server";
// import Categories from "./components/Categories";
// import { getCategories } from "@/lib/firestore/categories/read_server";
// import ProductGridView from "./components/Products";
// import CustomerReviews from "./components/CustomerReview";
// import Brands from "./components/Brands";
// import { getBrands } from "@/lib/firestore/brands/read_server";
// import Footer from "./components/Footer";

// export default async function Home() {
//   const [featuredProducts, collections, categories, products, brands] =
//     await Promise.all([
//       getFeaturedProducts(),
//       getCollections(),
//       getCategories(),
//       getProducts(),
//       getBrands(),
//     ]);

//   const fadeIn = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
//   };

//   return (
//     <main className="w-screen h-screen">
//       <section className="flex flex-col w-screen">
//         <MotionDiv
//           variants={fadeIn}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           <Header />
//         </MotionDiv>

//         <MotionDiv
//           variants={fadeIn}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           <FeaturedProductSlider featuredProducts={featuredProducts} />
//         </MotionDiv>

//         <MotionDiv
//           variants={fadeIn}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           <Collections collections={collections} />
//         </MotionDiv>

//         <MotionDiv
//           variants={fadeIn}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           <Categories categories={categories} />
//         </MotionDiv>

//         <MotionDiv
//           variants={fadeIn}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           <ProductGridView products={products} />
//         </MotionDiv>

//         <MotionDiv
//           variants={fadeIn}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           <CustomerReviews />
//         </MotionDiv>

//         <MotionDiv
//           variants={fadeIn}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           <Brands brands={brands} />
//         </MotionDiv>

//         <MotionDiv
//           variants={fadeIn}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//         >
//           <Footer />
//         </MotionDiv>
//       </section>
//     </main>
//   );
// }

// app/page.js
import {
  getFeaturedProducts,
  getProducts,
} from "@/lib/firestore/products/read_server";
import Header from "./components/Header";
import FeaturedProductSlider from "./components/Sliders";
import Collections from "./components/Collections";
import { getCollections } from "@/lib/firestore/collections/read_server";
import Categories from "./components/Categories";
import { getCategories } from "@/lib/firestore/categories/read_server";
import ProductGridView from "./components/Products";
import CustomerReviews from "./components/CustomerReview";
import Brands from "./components/Brands";
import { getBrands } from "@/lib/firestore/brands/read_server";
import Footer from "./components/Footer";
import dynamic from "next/dynamic";

// Dynamically import the AnimatedDiv component for client-side rendering
const AnimatedDiv = dynamic(() => import("./components/AnimateDiv"), {
  ssr: false,
});

const envCheck = () => {
  console.log(process.env.NEXT_PUBLIC_DOMAIN);
};

export default async function Home() {
  const [featuredProducts, collections, categories, products, brands] =
    await Promise.all([
      getFeaturedProducts(),
      getCollections(),
      getCategories(),
      getProducts(),
      getBrands(),
    ]);

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="w-screen h-screen overflow-x-hidden overflow-y-auto">
      <section className="flex flex-col w-screen">
        {envCheck()}
        <AnimatedDiv fadeIn={fadeIn}>
          <Header />
        </AnimatedDiv>

        <AnimatedDiv fadeIn={fadeIn}>
          <FeaturedProductSlider featuredProducts={featuredProducts} />
        </AnimatedDiv>

        <AnimatedDiv fadeIn={fadeIn}>
          <Collections collections={collections} />
        </AnimatedDiv>

        <AnimatedDiv fadeIn={fadeIn}>
          <Categories categories={categories} />
        </AnimatedDiv>

        <AnimatedDiv fadeIn={fadeIn}>
          <ProductGridView products={products} />
        </AnimatedDiv>

        <AnimatedDiv fadeIn={fadeIn}>
          <CustomerReviews />
        </AnimatedDiv>

        <AnimatedDiv fadeIn={fadeIn}>
          <Brands brands={brands} />
        </AnimatedDiv>

        <AnimatedDiv fadeIn={fadeIn}>
          <Footer />
        </AnimatedDiv>
      </section>
    </main>
  );
}
