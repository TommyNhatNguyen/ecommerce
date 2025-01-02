import { ImageCreateDTO } from "@/app/shared/interfaces/image/image.dto.d";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";
import { RcFile } from "antd/es/upload";

export const imagesService = {
  uploadImage: async (file: RcFile, data: ImageCreateDTO) => {
    const response = await axiosInstance.post(
      "/image",
      {
        file: file,
        ...data,
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
