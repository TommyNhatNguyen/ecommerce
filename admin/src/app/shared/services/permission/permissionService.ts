import { PermissionConditionDTO, PermissionUpdateDTO } from "@/app/shared/interfaces/permission/permission.dto";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import {
  Permission,
  RoleWithPermissions,
} from "@/app/shared/models/permission/permission.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const permissionService = {
  getPermissionList: async (
    query: PermissionConditionDTO,
  ): Promise<ListResponseModel<Permission>> => {
    const response = await axiosInstance.get("/permissions", { params: query });
    return response.data;
  },
  updatePermissionToRole: async (
    data: PermissionUpdateDTO,
  ): Promise<RoleWithPermissions> => {
    const response = await axiosInstance.put(
      `/roles/${data.role_id}/update-permissions`,
      data,
    );
    return response.data;
  },
};
