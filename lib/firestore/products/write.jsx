import { db, storage } from "@/lib/firebase"; // Your Firebase setup
import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

import { updateDoc } from "firebase/firestore"; // Import updateDoc for partial updates

/**
 * Create a new product in Firestore and Firebase Storage
 * @param {Object} params - Product details and images
 * @param {Object} params.data - Product data (e.g., title, description, price)
 * @param {File} params.featureImage - Feature image file
 * @param {Array<File>} params.imageList - Additional image files
 */
export const createNewProduct = async ({ data, featureImage, imageList }) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!featureImage) {
    throw new Error("Feature image is required");
  }

  // Upload Feature Image with a Unique Name
  const featureImageRef = ref(
    storage,
    `products/${uuidv4()}_${featureImage.name}`
  );
  await uploadBytes(featureImageRef, featureImage);
  const featureImageURL = await getDownloadURL(featureImageRef);

  // Upload Additional Images with Unique Names
  let imageURLList = [];
  if (imageList && Array.isArray(imageList)) {
    for (let i = 0; i < imageList.length; i++) {
      const image = imageList[i];
      const imageRef = ref(storage, `products/${uuidv4()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      imageURLList.push(url);
    }
  }

  // Generate a Unique ID for the Product
  const newId = doc(collection(db, `ids`)).id;

  // Save Product Details to Firestore
  await setDoc(doc(db, `products/${newId}`), {
    ...data,
    featureImageURL, // URL of the feature image
    imagePaths: imageURLList, // Array of URLs for additional images
    id: newId, // Unique product ID
    timestampCreate: Timestamp.now(), // Creation timestamp
  });

  console.log("Product created successfully:", newId);
};

/**
 * Delete a product and its associated images from Firestore and Firebase Storage
 * @param {Object} params - Product details
 * @param {string} params.id - Product ID
 */
export const deleteProduct = async ({ id }) => {
  if (!id) {
    throw new Error("Product ID is required");
  }

  // Get the product document from Firestore
  const productDocRef = doc(db, `products/${id}`);
  const productDoc = await getDoc(productDocRef);

  if (!productDoc.exists()) {
    throw new Error("Product not found");
  }

  const productData = productDoc.data();

  // Delete Feature Image from Firebase Storage
  if (productData.featureImageURL) {
    const featureImageRef = ref(storage, productData.featureImageURL);
    try {
      await deleteObject(featureImageRef);
      console.log("Feature image deleted successfully");
    } catch (error) {
      console.error("Failed to delete feature image:", error.message);
    }
  }

  // Delete Additional Images from Firebase Storage
  if (productData.imagePaths && Array.isArray(productData.imagePaths)) {
    for (const imagePath of productData.imagePaths) {
      const imageRef = ref(storage, imagePath);
      try {
        await deleteObject(imageRef);
        console.log(`Image ${imagePath} deleted successfully`);
      } catch (error) {
        console.error(`Failed to delete image ${imagePath}:`, error.message);
      }
    }
  }

  // Delete the Product Document from Firestore
  await deleteDoc(productDocRef);
  console.log("Product deleted successfully:", id);
};

/**
 * Update an existing product in Firestore and Firebase Storage
 * @param {Object} params - Product details and images
 * @param {string} params.id - Product ID to update
 * @param {Object} params.data - Updated product data (e.g., title, description, price)
 * @param {File} [params.featureImage] - New feature image file (optional)
 * @param {Array<File>} [params.imageList] - New additional image files (optional)
 */
// export const updateProduct = async ({ id, data, featureImage, imageList }) => {
//   if (!id) {
//     throw new Error("Product ID is required");
//   }

//   // Get the existing product document from Firestore
//   const productDocRef = doc(db, `products/${id}`);
//   const productDoc = await getDoc(productDocRef);

//   if (!productDoc.exists()) {
//     throw new Error("Product not found");
//   }

//   const productData = productDoc.data();

//   // Variables to hold updated image URLs
//   let updatedFeatureImageURL = productData.featureImageURL; // Start with the existing feature image
//   let updatedImagePaths = [...(productData.imagePaths || [])]; // Clone the existing image list

//   // If a new feature image is provided, delete the old one and upload the new one
//   if (featureImage) {
//     if (productData.featureImageURL) {
//       const oldFeatureImageRef = ref(storage, productData.featureImageURL);
//       try {
//         await deleteObject(oldFeatureImageRef);
//         console.log("Old feature image deleted successfully");
//       } catch (error) {
//         console.error("Failed to delete old feature image:", error.message);
//       }
//     }

//     // Upload the new feature image
//     const newFeatureImageRef = ref(
//       storage,
//       `products/${uuidv4()}_${featureImage.name}`
//     );
//     await uploadBytes(newFeatureImageRef, featureImage);
//     updatedFeatureImageURL = await getDownloadURL(newFeatureImageRef);
//   }

//   // If a new image list is provided, delete the old images and upload the new ones
//   if (imageList && Array.isArray(imageList)) {
//     // Delete old additional images
//     if (productData.imagePaths && Array.isArray(productData.imagePaths)) {
//       for (const oldImagePath of productData.imagePaths) {
//         const oldImageRef = ref(storage, oldImagePath);
//         try {
//           await deleteObject(oldImageRef);
//           console.log(`Old image ${oldImagePath} deleted successfully`);
//         } catch (error) {
//           console.error(
//             `Failed to delete old image ${oldImagePath}:`,
//             error.message
//           );
//         }
//       }
//     }

//     // Upload new additional images
//     updatedImagePaths = [];
//     for (const image of imageList) {
//       const newImageRef = ref(storage, `products/${uuidv4()}_${image.name}`);
//       await uploadBytes(newImageRef, image);
//       const newImageURL = await getDownloadURL(newImageRef);
//       updatedImagePaths.push(newImageURL);
//     }
//   }

//   // Prepare updated product data
//   const updatedProductData = {
//     ...productData, // Retain existing fields
//     ...data, // Apply updates from the input
//     featureImageURL: updatedFeatureImageURL, // Updated or existing feature image URL
//     imagePaths: updatedImagePaths, // Updated or existing additional image URLs
//     timestampUpdate: Timestamp.now(), // Update timestamp
//   };

//   // Update the product document in Firestore
//   await setDoc(productDocRef, updatedProductData);

//   console.log("Product updated successfully:", id);
// };

/**
 * Update an existing product in Firestore and Firebase Storage
 * @param {Object} params - Product details and images
 * @param {string} params.id - Product ID to update
 * @param {Object} params.data - Updated product data (e.g., title, description, price)
 * @param {File} [params.featureImage] - New feature image file (optional)
 * @param {Array<File>} [params.imageList] - New additional image files (optional)
 */
export const updateProduct = async ({ id, data, featureImage, imageList }) => {
  if (!id) {
    throw new Error("Product ID is required");
  }

  // Get the existing product document from Firestore
  const productDocRef = doc(db, `products/${id}`);
  const productDoc = await getDoc(productDocRef);

  if (!productDoc.exists()) {
    throw new Error("Product not found");
  }

  const productData = productDoc.data();

  // Variables to hold updated image URLs
  let updatedFeatureImageURL = productData.featureImageURL;
  let updatedImagePaths = [...(productData.imagePaths || [])]; // Clone the existing image list

  // If a new feature image is provided, delete the old one and upload the new one
  if (featureImage) {
    if (productData.featureImageURL) {
      const oldFeatureImageRef = ref(storage, productData.featureImageURL);
      try {
        await deleteObject(oldFeatureImageRef);
        console.log("Old feature image deleted successfully");
      } catch (error) {
        console.error("Failed to delete old feature image:", error.message);
      }
    }

    // Upload the new feature image
    const newFeatureImageRef = ref(
      storage,
      `products/${uuidv4()}_${featureImage.name}`
    );
    await uploadBytes(newFeatureImageRef, featureImage);
    updatedFeatureImageURL = await getDownloadURL(newFeatureImageRef);
  }

  // If a new image list is provided, delete the old images and upload the new ones
  if (imageList && Array.isArray(imageList)) {
    // Delete old additional images
    if (productData.imagePaths && Array.isArray(productData.imagePaths)) {
      for (const oldImagePath of productData.imagePaths) {
        const oldImageRef = ref(storage, oldImagePath);
        try {
          await deleteObject(oldImageRef);
          console.log(`Old image ${oldImagePath} deleted successfully`);
        } catch (error) {
          console.error(
            `Failed to delete old image ${oldImagePath}:`,
            error.message
          );
        }
      }
    }

    // Upload new additional images
    updatedImagePaths = [];
    for (const image of imageList) {
      const newImageRef = ref(storage, `products/${uuidv4()}_${image.name}`);
      await uploadBytes(newImageRef, image);
      const newImageURL = await getDownloadURL(newImageRef);
      updatedImagePaths.push(newImageURL);
    }
  }

  // Prepare the update payload
  const updatePayload = {
    ...data, // Apply updates from the input
    ...(featureImage && { featureImageURL: updatedFeatureImageURL }), // Update feature image only if provided
    ...(imageList && { imagePaths: updatedImagePaths }), // Update image list only if provided
    timestampUpdate: Timestamp.now(), // Update timestamp
  };

  // Update the product document in Firestore
  await updateDoc(productDocRef, updatePayload);

  console.log("Product updated successfully:", id);
};
