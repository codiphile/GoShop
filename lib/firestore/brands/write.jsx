import { db, storage } from "@/lib/firebase";

import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

// Create Brand
export const createNewBrand = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is Required");
  }
  if (!data?.name) {
    throw new Error("Name is required");
  }
  const newId = doc(collection(db, `ids`)).id;
  const imageRef = ref(storage, `brands/${newId}`);
  await uploadBytes(imageRef, image);
  const imageURL = await getDownloadURL(imageRef);

  await setDoc(doc(db, `brands/${newId}`), {
    ...data,
    id: newId,
    imageURL: imageURL,
    timestampCreate: Timestamp.now(),
  });
};

// Update Brand
export const updateBrand = async ({ data, image }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.slug) {
    throw new Error("Slug is required");
  }

  const id = data?.id;
  let imageURL = data?.imageURL;

  if (image) {
    // Delete the old image if it exists
    if (imageURL) {
      const oldImageRef = ref(storage, imageURL);
      await deleteObject(oldImageRef).catch((error) => {
        console.error("Failed to delete old image:", error.message);
      });
    }

    // Upload the new image
    const newImageRef = ref(storage, `brands/${id}`);
    await uploadBytes(newImageRef, image);
    imageURL = await getDownloadURL(newImageRef);
  }

  // Update the Firestore document with new data and image URL
  await updateDoc(doc(db, `brands/${id}`), {
    ...data,
    imageURL: imageURL,
    timestampUpdate: Timestamp.now(),
  });
};

// Delete Brand
export const deleteBrand = async ({ id }) => {
  if (!id) {
    throw new Error("Id is required");
  }

  // Fetch the category document to retrieve the image URL
  const brandDocRef = doc(db, `brands/${id}`);
  const brandDoc = await getDoc(brandDocRef);

  if (!brandDoc.exists()) {
    throw new Error("Category not found");
  }

  const brandData = brandDoc.data();
  const imageURL = brandData.imageURL;

  // Delete the image from the storage bucket
  if (imageURL) {
    const imageRef = ref(storage, imageURL);
    await deleteObject(imageRef).catch((error) => {
      console.error("Failed to delete image:", error.message);
      throw new Error("Image deletion failed");
    });
  }

  // Delete the category document from Firestore
  await deleteDoc(brandDocRef);
};
