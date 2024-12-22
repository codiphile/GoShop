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

export const createNewCollection = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is Required");
  }
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!data?.products || data?.products?.length === 0) {
    throw new Error("products is required");
  }
  const newId = doc(collection(db, `ids`)).id;
  const imageRef = ref(storage, `collections/${newId}`);
  await uploadBytes(imageRef, image);
  const imageURL = await getDownloadURL(imageRef);

  await setDoc(doc(db, `collections/${newId}`), {
    ...data,
    id: newId,
    imageURL: imageURL,
    timestampCreate: Timestamp.now(),
  });
};

export const updateCollection = async ({ data, image }) => {
  if (!data?.title) {
    throw new Error("Name is required");
  }
  if (!data?.products || data?.products?.length === 0) {
    throw new Error("products is required");
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
    const newImageRef = ref(storage, `collections/${id}`);
    await uploadBytes(newImageRef, image);
    imageURL = await getDownloadURL(newImageRef);
  }

  // Update the Firestore document with new data and image URL
  await updateDoc(doc(db, `collections/${id}`), {
    ...data,
    imageURL: imageURL,
    timestampUpdate: Timestamp.now(),
  });
};

export const deleteCollection = async ({ id }) => {
  if (!id) {
    throw new Error("Id is required");
  }

  // Fetch the category document to retrieve the image URL
  const collectionDocRef = doc(db, `categories/${id}`);
  const collectionDoc = await getDoc(collectionDocRef);

  if (!collectionDoc.exists()) {
    throw new Error("Collection not found");
  }

  const collectionData = collectionDoc.data();
  const imageURL = collectionData.imageURL;

  // Delete the image from the storage bucket
  if (imageURL) {
    const imageRef = ref(storage, imageURL);
    await deleteObject(imageRef).catch((error) => {
      console.error("Failed to delete image:", error.message);
      throw new Error("Image deletion failed");
    });
  }

  // Delete the category document from Firestore
  await deleteDoc(collectionDocRef);
};
