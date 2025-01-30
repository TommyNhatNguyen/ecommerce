import { useNotification } from "@/app/contexts/NotificationContext";
import { RoleCreateDTO } from "@/app/shared/interfaces/role/role.dto";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { roleService } from "@/app/shared/services/role/roleService";
import { useState } from "react";

export const useRole = () => {
  const {notificationApi} = useNotification()
  const [isChangeStatusLoading, setIsChangeStatusLoading] = useState(false);
  const [isDeleteRoleLoading, setIsDeleteRoleLoading] = useState(false);
  const [isCreateRoleLoading, setIsCreateRoleLoading] = useState(false);
  const handleCreateRole = async (data: RoleCreateDTO, callback: () => void) => {
    try {
      setIsCreateRoleLoading(true);
      const response = await roleService.createRole(data);
      if (response) {
        notificationApi.success({
          message: "Role created successfully",
          description: "Role created successfully",
        });
      }
    } catch (error) {
      notificationApi.error({
        message: "Failed to create role",
        description: "Failed to create role",
      });
    } finally {
      setIsCreateRoleLoading(false);
      callback();
    }
  }
  const handleChangeRoleStatus = async (
    role_id: string,
    role_status: ModelStatus,
  ) => {
    try {
      setIsChangeStatusLoading(true);
      const response = await roleService.updateRoleStatus(role_id, role_status);
      if (response) {
        notificationApi.success({
          message: "Role status updated successfully",
          description: "Role status updated successfully",
        });
      }
    } catch (error) {
      notificationApi.error({
        message: "Failed to update role status",
        description: "Failed to update role status",
      });
    } finally {
      setIsChangeStatusLoading(false);
    }
  };
  const handleDeleteRole = async (role_id: string) => {
    try {
      setIsDeleteRoleLoading(true);
      const response = await roleService.deleteRole(role_id);
      if (response) {
        notificationApi.success({
          message: "Role deleted successfully",
          description: "Role deleted successfully",
        });
      }
    } catch (error) {
      notificationApi.error({
        message: "Failed to delete role",
        description: "Failed to delete role",
      });
    } finally {
      setIsDeleteRoleLoading(false);
    }
  };
  return {
    isChangeStatusLoading,
    isDeleteRoleLoading,
    handleChangeRoleStatus,
    handleDeleteRole,
    handleCreateRole,
    isCreateRoleLoading,
  };
};
