import React, { useState } from "react";
import {
  getContainerClient,
  uploadImageToBlob,
} from "&server/utils/ImageUpload";

// components
import Button from "&components/Button";
import Input from "&components/Input";

const handleImageUpload = async (image: File) => {
  const containerClient = await getContainerClient();

  const url = await uploadImageToBlob(containerClient!, image);
};

const ImageUpload: React.FC = () => {
  // current file to upload into container
  const [fileSelected, setFileSelected] = useState(null);

  // form management
  const [uploading, setUploading] = useState(false);

  const onFileChange = (event: any) => {
    // capture file into state
    setFileSelected(event.target.files[0]);
  };

  const onFileUpload = async () => {
    // prepare UI
    setUploading(true);

    // *** UPLOAD TO AZURE STORAGE ***
    await handleImageUpload(fileSelected);

    // reset state/form
    setUploading(false);
  };

  return (
    <div>
      <Input type="file" onChange={onFileChange} />
      <Button type="submit" onClick={onFileUpload}>
        <h3>Upload Image</h3>
      </Button>
    </div>
  );
};

export default ImageUpload;
