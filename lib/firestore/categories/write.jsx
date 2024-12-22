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

export const createNewCategory = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is Required");
  }
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.slug) {
    throw new Error("Slug is required");
  }
  const newId = doc(collection(db, `ids`)).id;
  const imageRef = ref(storage, `categories/${newId}`);
  await uploadBytes(imageRef, image);
  const imageURL = await getDownloadURL(imageRef);

  await setDoc(doc(db, `categories/${newId}`), {
    ...data,
    id: newId,
    imageURL: imageURL,
    timestampCreate: Timestamp.now(),
  });
};

export const updateCategory = async ({ data, image }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.slug) {
    throw new Error("Slug is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
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
    const newImageRef = ref(storage, `categories/${id}`);
    await uploadBytes(newImageRef, image);
    imageURL = await getDownloadURL(newImageRef);
  }

  // Update the Firestore document with new data and image URL
  await updateDoc(doc(db, `categories/${id}`), {
    ...data,
    imageURL: imageURL,
    timestampUpdate: Timestamp.now(),
  });
};

export const deleteCategory = async ({ id }) => {
  if (!id) {
    throw new Error("Id is required");
  }

  // Fetch the category document to retrieve the image URL
  const categoryDocRef = doc(db, `categories/${id}`);
  const categoryDoc = await getDoc(categoryDocRef);

  if (!categoryDoc.exists()) {
    throw new Error("Category not found");
  }

  const categoryData = categoryDoc.data();
  const imageURL = categoryData.imageURL;

  // Delete the image from the storage bucket
  if (imageURL) {
    const imageRef = ref(storage, imageURL);
    await deleteObject(imageRef).catch((error) => {
      console.error("Failed to delete image:", error.message);
      throw new Error("Image deletion failed");
    });
  }

  // Delete the category document from Firestore
  await deleteDoc(categoryDocRef);
};
