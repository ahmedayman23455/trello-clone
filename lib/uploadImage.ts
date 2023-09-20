import { ID, storage } from "@/appwrite";

export const uploadImage = async (file: File) => {
  if (!file) return;

  const fileUploaded = await storage.createFile(
    "650676d3d7e177b65ca8",
    ID.unique(),
    file
  );

  return fileUploaded;
};
