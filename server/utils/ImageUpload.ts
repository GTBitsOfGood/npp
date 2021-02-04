import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

// TODO: how do we want to handle this url?
const AZURE_STORAGE_CONNECTION_STRING = `DefaultEndpointsProtocol=https;AccountName=npp;AccountKey=X87AzrIDo0SUBeflk4uIXrPq5wdZsps9V5MqIfFS2p4kMyDFMugA3yTs0BifXJnHxlamIIgEqjL7iCb3yGU1ew==;EndpointSuffix=core.windows.net`;

export async function getContainerClient(): Promise<ContainerClient> {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  const containerClient = blobServiceClient.getContainerClient(
    "image-container"
  );

  return containerClient;
}

export async function uploadImageToBlob(
  containerClient: ContainerClient,
  image: File
): Promise<string> {
  const blobClient = containerClient.getBlockBlobClient(image.name);
  const options = { blobHTTPHeaders: { blobContentType: image.type } };

  await blobClient.uploadBrowserData(image, options);

  return blobClient.url;
}
