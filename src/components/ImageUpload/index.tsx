import React, { useEffect, useRef, useState } from "react";
import { UploadedFile, uploadUserFileToBlob } from "&server/utils/ImageUpload";
//Libraries
import clsx from "clsx";
// Components
import Input from "&components/Input";
import Button from "&components/Button";
import ProgressBar from "@ramonak/react-progress-bar";
// Styling
import classes from "./ImageUpload.module.scss";
import { useSession } from "&utils/auth-utils";
import UploadedImage from "&icons/UploadedImage";
import CloseIcon from "&icons/CloseIcon";

interface Props {
  setImages: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  images: UploadedFile[];
}

const ImageUpload: React.FC<Props> = ({ images, setImages }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [session, loading] = useSession();
  const [uploadProgress, setUploadProgress] = useState(-1);

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
    setUploadProgress(0);
    const uploadedFile = await uploadUserFileToBlob(
      fileSelected,
      session.user,
      (progressPercent) => setUploadProgress(Math.floor(progressPercent * 100))
    );
    if (uploadedFile) {
      images.push(uploadedFile);
      setImages(images);
    }
    setTimeout(() => {
      // delay a bit to show progress complete
      setFileSelected(null);
      setIsVisible(false);
      setUploadProgress(-1);
    }, 1000);
  };

  const allowDragOver = (event: any) => {
    event.preventDefault();
  };

  return (
    <div>
      <ul className={clsx(classes.imageList)}>
        {images.map((uploadedImage, index) => (
          <li key={uploadedImage.blobName}>
            <UploadedImage className={clsx(classes.verticallyCentered)} />
            <span className={clsx(classes.verticallyCentered)}>
              {uploadedImage.name}
            </span>
            <CloseIcon
              onClick={() => {
                images.splice(index, 1);
                setImages([...images]);
              }}
              style={{ cursor: "pointer", marginLeft: "5px" }}
              className={clsx(classes.verticallyCentered)}
            />
          </li>
        ))}
      </ul>
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
                {!fileSelected && (
                  <React.Fragment>
                    <h2>Drag and drop</h2>
                    <h2>or</h2>
                    <h2 className={clsx(classes.browse)}>Browse</h2>
                  </React.Fragment>
                )}
                {fileSelected && (
                  <React.Fragment>
                    <h2>Selected</h2>
                    <h2 className={clsx(classes.browse)}>
                      {(fileSelected as File).name}
                    </h2>
                  </React.Fragment>
                )}
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
              {uploadProgress >= 0 && (
                <div style={{ width: "80%" }}>
                  <ProgressBar bgcolor={"#fd8033"} completed={uploadProgress} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
