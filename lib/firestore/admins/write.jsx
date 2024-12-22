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

// Create Admin
export const createNewAdmin = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is required");
  }
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.email) {
    throw new Error("Email is required");
  }
  const newId = data?.email;
  const imageRef = ref(storage, `admins/${newId}`);
  await uploadBytes(imageRef, image);
  const imageURL = await getDownloadURL(imageRef);

  await setDoc(doc(db, `admins/${newId}`), {
    ...data,
    id: newId,
    imageURL: imageURL, // Store relative path
    timestampCreate: Timestamp.now(),
  });
};

// Update Admin
// export const updateAdmin = async ({ data, image }) => {
//   if (!data?.name) {
//     throw new Error("Name is required");
//   }
//   if (!data?.id) {
//     throw new Error("ID is required");
//   }
//   if (!data?.email) {
//     throw new Error("Email is required");
//   }

//   const id = data?.id;
//   let imageURL = data?.imageURL;

//   if (image) {
//     // Delete the old image if it exists
//     if (imageURL) {
//       const oldImageRef = ref(storage, imageURL); // Ensure `imageURL` is a relative path
//       await deleteObject(oldImageRef).catch((error) => {
//         console.error("Failed to delete old image:", error.message);
//       });
//     }

//     // Upload the new image
//     const newImageRef = ref(storage, `admins/${id}`);
//     await uploadBytes(newImageRef, image);
//     imageURL = `admins/${id}`; // Save the relative path
//   }

//   // Update or Create Document
//   if (id === data?.email) {
//     await updateDoc(doc(db, `admins/${id}`), {
//       ...data,
//       imageURL: imageURL,
//       timestampUpdate: Timestamp.now(),
//     });
//   } else {
//     const newId = data?.email;
//     // Delete the old document
//     await deleteDoc(doc(db, `admins/${id}`));

//     // Create the new document
//     await setDoc(doc(db, `admins/${newId}`), {
//       ...data,
//       id: newId,
//       imageURL: imageURL,
//       timestampCreate: Timestamp.now(), // Add create timestamp for the new document
//     });
//   }
// };
// Update Admin

export const updateAdmin = async ({ data, image }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }
  if (!data?.email) {
    throw new Error("Email is required");
  }

  const id = data?.id; // Current document ID
  const newId = data?.email; // New email, potentially the new ID

  let imageURL = data?.imageURL;

  if (image) {
    // Delete the old image if it exists
    if (imageURL) {
      const oldImageRef = ref(storage, imageURL); // Ensure `imageURL` is a relative path
      await deleteObject(oldImageRef).catch((error) => {
        console.error("Failed to delete old image:", error.message);
      });
    }

    // Upload the new image
    const newImageRef = ref(storage, `admins/${newId}`); // Save under new ID
    await uploadBytes(newImageRef, image);

    // Get the download URL of the new image
    imageURL = await getDownloadURL(newImageRef);
  }

  if (id === newId) {
    // Update the existing document
    await updateDoc(doc(db, `admins/${id}`), {
      ...data,
      imageURL: imageURL, // Store the full download URL
      timestampUpdate: Timestamp.now(),
    });
  } else {
    // ID has changed, create a new document and delete the old one
    await deleteDoc(doc(db, `admins/${id}`)); // Delete old document

    await setDoc(doc(db, `admins/${newId}`), {
      ...data,
      id: newId,
      imageURL: imageURL, // Store the full download URL
      timestampCreate: Timestamp.now(), // Set timestamp for the new document
    });
  }
};

// Delete Admins
export const deleteAdmin = async ({ id }) => {
  if (!id) {
    throw new Error("Id is required");
  }

  const AdminDocRef = doc(db, `admins/${id}`);
  const AdminDoc = await getDoc(AdminDocRef);

  if (!AdminDoc.exists()) {
    throw new Error("Admin not found");
  }

  const AdminData = AdminDoc.data();
  const imageURL = AdminData.imageURL;

  // Delete the image from storage
  if (imageURL) {
    const imageRef = ref(storage, imageURL); // Ensure relative path is stored
    await deleteObject(imageRef);
  }

  // Delete the document
  await deleteDoc(AdminDocRef);
};
