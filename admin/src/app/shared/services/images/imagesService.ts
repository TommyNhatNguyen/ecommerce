import { ListResponseModel } from "./../../models/others/list-response.model.d";
import {
  ImageConditionDTO,
  ImageCreateDTO,
} from "@/app/shared/interfaces/image/image.dto.d";
import { ImageModel, ImageResponse } from "@/app/shared/models/images/images.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";
import { RcFile } from "antd/es/upload";

export const imagesService = {
  uploadImage: async (
    file: RcFile,
    data: ImageCreateDTO,
  ): Promise<ImageResponse> => {
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
    return response.data as ImageResponse;
  },
  deleteImage: async (id: string) => {
    const response = await axiosInstance.delete(`/image/${id}`);
    return response;
  },
  getImages: async (
    condition?: ImageConditionDTO,
  ): Promise<ListResponseModel<ImageModel>> => {
    const response = await axiosInstance.get("/image", {
      params: condition,
    });
    return response.data;
  },
};
