import React, { useState, useEffect, useRef } from "react";
import { uploadFileToBlob } from "&server/utils/ImageUpload";

//Libraries
import clsx from "clsx";

// Components
import Input from "&components/Input";
import Button from "&components/Button";

// Styling
import classes from "./ImageUpload.module.scss";

interface Props {
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

const ImageUpload: React.FC<Props> = ({ setImageUrl }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = (event: any) => {
    // if (ref.current && !ref.current.contains(event.target)) {
    //   setIsVisible(false);
    // }
  };

  const onFileChange = (event: any) => {
    setFileSelected(event.target.files[0]);
  };

  const onFileUpload = async () => {
    const url = await uploadFileToBlob(fileSelected);

    setImageUrl(url);
  };

  return (
    <div>
      <Button
        type="submit"
        variant="primary"
        className="uploadImage"
        onClick={() => setIsVisible(true)}
      >
        <h3>Attach a Screenshot?</h3>
      </Button>
      {isVisible && (
        <div className={clsx(classes.modal)}>
          <div ref={ref} className={clsx(classes.modalContainer)}>
            <div className={clsx(classes.container)}>
              <div className={clsx(classes.header)}>
                <h1>Upload Files</h1>
              </div>
              <div className={clsx(classes.input)}>
                <Input type="file" onChange={onFileChange} />
              </div>
              <div className={clsx(classes.button)}>
                <Button type="submit" variant="primary" onClick={onFileUpload}>
                  <h3>Upload</h3>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
