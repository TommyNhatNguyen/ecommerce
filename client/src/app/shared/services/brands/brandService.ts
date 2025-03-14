import {
  BrandConditionDTO,
  BrandCreateDTO,
  BrandUpdateDTO,
} from "@/app/shared/interfaces/brands/brands.dto";
import { BrandModel } from "@/app/shared/models/brands/brands.model";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const brandService = {
  createBrand: async (data: BrandCreateDTO): Promise<BrandModel> => {
    const response = await axiosInstance.post("/brands", data);
    return response.data;
  },
  getAllBrands: async (
    query?: BrandConditionDTO,
  ): Promise<{ data: BrandModel[] }> => {
    const response = await axiosInstance.get(`/brands/all`, {
      params: query,
    });
    return response.data;
  },
  getBrandById: async (
    id: string,
    data?: BrandConditionDTO,
  ): Promise<BrandModel> => {
    const response = await axiosInstance.get(`/brands/${id}`, {
      params: data,
    });
    return response.data;
  },
  updateBrand: async (
    id: string,
    data: BrandUpdateDTO,
  ): Promise<BrandModel> => {
    const response = await axiosInstance.put(`/brands/${id}`, data);
    return response.data;
  },
  deleteBrand: async (id: string): Promise<BrandModel> => {
    const response = await axiosInstance.delete(`/brands/${id}`);
    return response.data;
  },
};
