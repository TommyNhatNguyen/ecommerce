import { axiosInstance } from "@/app/shared/utils/axiosInstance";
import { UploadFile } from "antd";

export const imagesService = {
  uploadImage: async (file: UploadFile) => {
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
