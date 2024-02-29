import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

export default async function uploadFileToStorage(
  storage: any,
  fileName: string,
  file: any
) {
  // Create a reference to the file
  const fileRef = storageRef(storage, fileName);

  const metadata = { contentType: file ? file.type : null };

  // Upload the file to Firebase Storage
  await uploadBytes(fileRef, file, metadata);

  // Obtain the download URL for the uploaded file
  const fileUrl = await getDownloadURL(fileRef);

  return fileUrl;
}
