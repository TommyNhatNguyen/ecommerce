import { Inbox } from "lucide-react";

import { UploadProps } from "antd";
import { useState } from "react";

import { UploadFile } from "antd";
import Dragger from "antd/es/upload/Dragger";

type Props = {
  isSingle?: boolean;
  description?: string;
  onImageChange?: (images: { [key: string]: UploadFile }) => void;
} & UploadProps;

export const CustomerDragger = ({
  action = `${window.location.origin}`,
  isSingle = false,
  description = "Click or drag file to this area to upload blog thumbnail",
  onImageChange,
  ...props
}: Props) => {
  const [previewImage, setPreviewImage] = useState<{
    [key: string]: UploadFile;
  }>({});
  const _onChangeFile = (file: UploadFile) => {
    // Check if the file is already in the previewImage, then remove it
    if (Object.keys(previewImage).includes(file.uid)) {
      setPreviewImage((prev) => {
        const newPreviewImage = { ...prev };
        delete newPreviewImage[file.uid];
        return newPreviewImage;
      });
      onImageChange?.(previewImage);
      return;
    }
    const newPreviewImage = isSingle
      ? { [file.uid]: file }
      : { ...previewImage, [file.uid]: file };
    setPreviewImage(newPreviewImage);
    onImageChange?.(newPreviewImage); // Call the callback
  };
  return (
    <Dragger
      {...props}
      onChange={(file) => _onChangeFile(file.file)}
      multiple={!isSingle}
      fileList={Object.values(previewImage)}
      action={action}
    >
      <div className="w-full">
        <Inbox className="mx-auto h-10 w-10" />
      </div>
      <p className="ant-upload-text">{description}</p>
    </Dragger>
  );
};
