import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { RoleListConditionDTO } from "@/app/shared/interfaces/role/role.dto";
import { Role } from "@/app/shared/models/role/role.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const roleService = {
  getRoleList: async (
    query: RoleListConditionDTO,
  ): Promise<ListResponseModel<Role>> => {
    const response = await axiosInstance.get("/roles", { params: query });
    return response.data;
  },
};
