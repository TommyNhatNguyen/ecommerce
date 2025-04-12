import { useNotification } from "@/app/contexts/NotificationContext";
import { ICreateUserDTO } from "@/app/shared/interfaces/user/user.dto";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { userService } from "@/app/shared/services/user/userService";
import { useState } from "react";

export const useUser = () => {
  const [isUpdateUserStatusLoading, setIsUpdateUserStatusLoading] =
    useState(false);
  const [isUpdateUserRoleLoading, setIsUpdateUserRoleLoading] = useState(false);
  const [isDeleteUserLoading, setIsDeleteUserLoading] = useState(false);
  const [isCreateUserLoading, setIsCreateUserLoading] = useState(false);
  const { notificationApi } = useNotification();
  const handleUpdateUserStatus = async (id: string, status: ModelStatus) => {
    try {
      setIsUpdateUserStatusLoading(true);
      const response = await userService.updateUserStatus(id, status);
      if (response) {
        notificationApi.success({
          message: "Update user status success",
          description: "User status has been updated successfully",
        });
      }
    } catch (error) {
      notificationApi.error({
        message: "Update user status failed",
        description: "An error occurred while updating user status",
      });
    } finally {
      setIsUpdateUserStatusLoading(false);
    }
  }
  const handleUpdateUserRole = async (id: string, role_id: string) => {
    try {
      setIsUpdateUserRoleLoading(true);
      const response = await userService.updateUserRole(id, role_id);
      if (response) {
        notificationApi.success({
          message: "Update user role success",
          description: "User role has been updated successfully",
        });
      }
    } catch (error) {
      notificationApi.error({
        message: "Update user role failed",
        description: "An error occurred while updating user role",
      });
    } finally {
      setIsUpdateUserRoleLoading(false);
    }
  }
  const handleDeleteUser = async (id: string) => {
    try {
      setIsDeleteUserLoading(true);
      const response = await userService.deleteUser(id);
      if (response) {
        notificationApi.success({
          message: "Delete user success",
          description: "User has been deleted successfully",
        });
      }
    } catch (error) {
      notificationApi.error({
        message: "Delete user failed",
        description: "An error occurred while deleting user",
      });
    } finally {
      setIsDeleteUserLoading(false);
    }
  }
  const handleCreateUser = async (data: ICreateUserDTO, callback: () => void) => {
    try {
      setIsCreateUserLoading(true);
      const response = await userService.createUser(data);
      if (response) {
        notificationApi.success({
          message: "Create user success",
          description: "User has been created successfully",
        });
      }
    } catch (error) {
      notificationApi.error({
        message: "Create user failed",
        description: "An error occurred while creating user",
      });
    } finally {
      setIsCreateUserLoading(false);
      callback();
    }
  }
  return {
    isUpdateUserStatusLoading,
    isUpdateUserRoleLoading,
    isDeleteUserLoading,
    handleUpdateUserStatus,
    handleUpdateUserRole,
    handleDeleteUser,
    handleCreateUser,
    isCreateUserLoading,
  };
}
