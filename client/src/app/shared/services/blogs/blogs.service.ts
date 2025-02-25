import {
  IBlogsCondition,
  IBlogsCreate,
  IBlogsUpdate,
} from "@/app/shared/interfaces/blogs/blogs.interface";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const blogsService = {
  get: async (id: string, query?: IBlogsCondition) => {
    const response = await axiosInstance.get(`/blogs/${id}`, {
      params: query,
    });
    return response.data;
  },
  list: async (query?: IBlogsCondition) => {
    const response = await axiosInstance.get("/blogs", {
      params: query,
    });
    return response.data;
  },
  create: async (data: IBlogsCreate) => {
    const response = await axiosInstance.post("/blogs", data);
    return response.data;
  },
  update: async (id: string, data: IBlogsUpdate) => {
    const response = await axiosInstance.put(`/blogs/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/blogs/${id}`);
    return response.data;
  },
};
