import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

const sasToken = process.env.STORAGE_SAS_TOKEN; // Fill string with your SAS token
console.log(sasToken);
const containerName = "image-container";
const storageAccountName =
  process.env.STORAGE_RESOURCE_NAME || "nonprofitportal"; // Fill string with your Storage resource name
console.log(storageAccountName);

export const uploadFileToBlob = async (file: File | null): Promise<string> => {
  if (!file) return "";

  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  const containerClient: ContainerClient = blobService.getContainerClient(
    containerName
  );

  await containerClient.createIfNotExists({
    access: "container",
  });

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
