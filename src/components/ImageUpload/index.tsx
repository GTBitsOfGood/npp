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
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  const onFileChange = (event: any) => {
    if (event.target.files !== null && event.target.files !== undefined) {
      const file = setFileSelected(event.target.files[0]);
      return file;
    }
  };

  const onFileUpload = async () => {
    const url = await uploadFileToBlob(fileSelected, (progressPercent) =>
      console.log(progressPercent)
    );
    setImageUrl(url);
    setIsVisible(false);
  };

  const allowDragOver = (event: any) => {
    event.preventDefault();
  };

  return (
    <div>
      <Button
        type="submit"
        variant="primary"
        className={clsx(classes.imageUpload)}
        onClick={() => setIsVisible(true)}
      >
        <h3>Upload File</h3>
      </Button>
      {isVisible && (
        <div className={clsx(classes.modal)}>
          <div ref={ref} className={clsx(classes.modalContainer)}>
            <div className={clsx(classes.header)}>
              <h1>Upload File</h1>
            </div>
            <div className={clsx(classes.container)}>
              {/* insert status bar here */}
              <div className={clsx(classes.input)}>
                <h2>Drag and drop</h2>
                <h2>or</h2>
                <h2 className={clsx(classes.browse)}>Browse</h2>
                <Input
                  type="file"
                  id={clsx(classes.file)}
                  className={clsx(classes.file)}
                  onChange={onFileChange}
                  onDrop={onFileChange}
                  onDragOver={allowDragOver}
                />
              </div>
              <div className={clsx(classes.button)}>
                <Button
                  type="submit"
                  variant="primary"
                  className={clsx(classes.upload)}
                  onClick={onFileUpload}
                >
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
