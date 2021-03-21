import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

const sasToken = process.env.NEXT_PUBLIC_STORAGE_SAS_TOKEN; // Fill string with your SAS token
const containerName = "image-container";
const storageAccountName =
  process.env.STORAGE_RESOURCE_NAME || "nonprofitportal"; // Fill string with your Storage resource name

export const uploadFileToBlob = async (file: File | null): Promise<string> => {
  if (!file) return "";

  const containerClient: ContainerClient = new ContainerClient(
    `https://${storageAccountName}.blob.core.windows.net/${containerName}?${sasToken}`
  );
  return await createBlobInContainer(containerClient, file);
};

const createBlobInContainer = async (
  containerClient: ContainerClient,
  image: File
) => {
  const blobClient = containerClient.getBlockBlobClient(image.name);

  const options = { blobHTTPHeaders: { blobContentType: image.type } };

  await blobClient.uploadBrowserData(image, options);

  return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${image.name}`;
};
