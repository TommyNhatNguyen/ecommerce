import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { RoleCreateDTO, RoleListConditionDTO } from "@/app/shared/interfaces/role/role.dto";
import { Role } from "@/app/shared/models/role/role.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";
import { ModelStatus } from "@/app/shared/models/others/status.model";

export const roleService = {
  getRoleList: async (
    query: RoleListConditionDTO,
  ): Promise<ListResponseModel<Role>> => {
    const response = await axiosInstance.get("/roles", { params: query });
    return response.data;
  },
  getRoleById: async (
    id: string,
    query: RoleListConditionDTO,
  ): Promise<Role> => {
    const response = await axiosInstance.get(`/roles/${id}`, { params: query });
    return response.data;
  },
  updateRoleStatus: async (id: string, status: ModelStatus): Promise<Role> => {
    const response = await axiosInstance.put(`/roles/${id}`, {
      status: status,
    });
    return response.data;
  },
  deleteRole: async (id: string): Promise<boolean> => {
    const response = await axiosInstance.delete(`/roles/${id}`);
    return response.data;
  },
  createRole: async (data: RoleCreateDTO): Promise<Role> => {
    const response = await axiosInstance.post("/roles", data);
    return response.data;
  },
};
