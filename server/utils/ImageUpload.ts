import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

const sasToken =
  process.env.storagesastoken ||
  "sv=2019-12-12&ss=b&srt=sco&sp=rwdlacx&se=2021-02-09T08:03:52Z&st=2021-02-09T00:03:52Z&spr=https&sig=huSsjMTIgztooX2xhIfFsXDxAeiLINye1%2FCzyu3%2Fnh4%3D"; // Fill string with your SAS token
const containerName = "image-container";
const storageAccountName = process.env.storageresourcename || "npp"; // Fill string with your Storage resource name

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
