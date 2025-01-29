"use client";
import EmployeePermission from "@/app/(dashboard)/admin/(content)/permissions/components/EmployeePermission";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useAppDispatch, useAppSelector } from "@/app/shared/hooks/useRedux";
import { permissionService } from "@/app/shared/services/permission/permissionService";
import { roleService } from "@/app/shared/services/role/roleService";
import { getUserInfo } from "@/app/shared/store/reducers/auth";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import React, { useMemo, useState } from "react";
import update from 'immutability-helper';
import { PermissionUpdateDTO } from "@/app/shared/interfaces/permission/permission.dto";

type Props = {};

const PERMISSION_TYPE = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  VIEW: "view",
};

export default function PermissionPage() {
  const dispatch = useAppDispatch();
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const { notificationApi } = useNotification();
  const { userPermission, userInfo } = useAppSelector((state) => state.auth);
  const { data: permissionsData, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: () =>
      permissionService.getPermissionList({
        is_get_all: true,
        page: 1,
        limit: 1000,
      }),
    placeholderData: keepPreviousData,
  });
  const permissions = permissionsData?.data;
  return (
    <div>
      <div>
        <div className="grid grid-cols-5 gap-4 text-center">
          <span></span>
          {Object.values(PERMISSION_TYPE).map((type) => (
            <span className="capitalize" key={type}>
              {type}
            </span>
          ))}
        </div>
        <div className="mt-4 flex w-full flex-col gap-4">
          {permissions?.map((permission) => {
            const { type, id } = permission;
            const permissionList = userPermission.find(
              (item) => item.type === type,
            );
            const {
              allow_create,
              allow_delete,
              allow_read,
              allow_update,
              permission_id,
              role_id,
            } = permissionList?.permission_role || {};
            const handleUpdatePermission = async (type: string) => {
              const payload: PermissionUpdateDTO = {
                role_id: role_id || userInfo?.role_id || "",
                permission_id: permission_id || id || "",
                allow_create: allow_create || false,
                allow_delete: allow_delete || false,
                allow_read: allow_read || false,
                allow_update: allow_update || false,
              };
              switch (type) {
                case PERMISSION_TYPE.CREATE:
                  payload.allow_create = !allow_create;
                  break;
                case PERMISSION_TYPE.UPDATE:
                  payload.allow_update = !allow_update;
                  break;
                case PERMISSION_TYPE.DELETE:
                  payload.allow_delete = !allow_delete;
                  break;
                case PERMISSION_TYPE.VIEW:
                  payload.allow_read = !allow_read;
                  break;
              }
              try {
                setIsUpdateLoading(true);
                const response =
                  await permissionService.updatePermissionToRole(payload);
                if (response) {
                  notificationApi.success({
                    message: "Update permission successfully",
                    description: "Update permission successfully",
                  });
                }
              } catch (error) {
                notificationApi.error({
                  message: "Update permission failed",
                  description: "Update permission failed",
                });
              } finally {
                setIsUpdateLoading(false);
                dispatch(getUserInfo());
              }
            };
            return (
              <div key={id} className="grid grid-cols-5 gap-4">
                <span className="self-center capitalize">{type}</span>
                {allow_create ? (
                  <Button
                    variant="outlined"
                    className="border-2 border-green-500 text-green-500"
                    onClick={() =>
                      handleUpdatePermission(PERMISSION_TYPE.CREATE)
                    }
                  >
                    Active
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    className="border-2 border-red-500 text-red-500"
                    onClick={() =>
                      handleUpdatePermission(PERMISSION_TYPE.CREATE)
                    }
                  >
                    Inactive
                  </Button>
                )}
                {allow_delete ? (
                  <Button
                    variant="outlined"
                    className="border-2 border-green-500 text-green-500"
                    onClick={() =>
                      handleUpdatePermission(PERMISSION_TYPE.DELETE)
                    }
                  >
                    Active
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    className="border-2 border-red-500 text-red-500"
                    onClick={() =>
                      handleUpdatePermission(PERMISSION_TYPE.DELETE)
                    }
                  >
                    Inactive
                  </Button>
                )}
                {allow_read ? (
                  <Button
                    variant="outlined"
                    className="border-2 border-green-500 text-green-500"
                    onClick={() => handleUpdatePermission(PERMISSION_TYPE.VIEW)}
                  >
                    Active
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    className="border-2 border-red-500 text-red-500"
                    onClick={() => handleUpdatePermission(PERMISSION_TYPE.VIEW)}
                  >
                    Inactive
                  </Button>
                )}
                {allow_update ? (
                  <Button
                    variant="outlined"
                    className="border-2 border-green-500 text-green-500"
                    onClick={() =>
                      handleUpdatePermission(PERMISSION_TYPE.UPDATE)
                    }
                  >
                    Active
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    className="border-2 border-red-500 text-red-500"
                    onClick={() =>
                      handleUpdatePermission(PERMISSION_TYPE.UPDATE)
                    }
                  >
                    Inactive
                  </Button>
                )}
              </div>
            );
          })}
            
        </div>
      </div>
      <EmployeePermission />
    </div>
  );
}
