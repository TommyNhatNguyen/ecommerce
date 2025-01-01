import { axiosInstance } from "@/app/shared/utils/axiosInstance";
import { UploadFile } from "antd";
import { RcFile } from "antd/es/upload";

export const imagesService = {
  uploadImage: async (file: RcFile) => {
    const response = await axiosInstance.post(
      "/image",
      {
        file: file,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response;
  },
};
