import React, { useState } from "react";
import { uploadFileToBlob } from "&server/utils/ImageUpload";

import classes from "./ImageUpload.module.scss";

interface Props {
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

const ImageUpload: React.FC<Props> = ({ setImageUrl }) => {
  const [fileSelected, setFileSelected] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onFileChange = (event: any) => {
    setFileSelected(event.target.files[0]);
  };

  const onFileUpload = async () => {
    setUploading(true);

    const url = await uploadFileToBlob(fileSelected);

    setImageUrl(url);

    setUploading(false);
  };

  return (
    <div className="screenshot">
      <input type="file" onChange={onFileChange} />
      <button type="submit" onClick={onFileUpload}>
        <h3>Upload Image</h3>
      </button>
    </div>
  );
};

export default ImageUpload;
