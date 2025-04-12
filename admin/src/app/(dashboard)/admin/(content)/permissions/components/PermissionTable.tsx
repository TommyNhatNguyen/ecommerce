"use client";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useAppDispatch, useAppSelector } from "@/app/shared/hooks/useRedux";
import { PermissionUpdateDTO } from "@/app/shared/interfaces/permission/permission.dto";
import { Permission } from "@/app/shared/models/permission/permission.model";
import { permissionService } from "@/app/shared/services/permission/permissionService";
import { getUserInfo } from "@/app/shared/store/reducers/auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

type Props = {
  userPermission: Partial<Permission>[];
  selectedRoleId: string;
  refetchPermission?: () => void;
};
const PERMISSION_TYPE = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  VIEW: "view",
};

const PermissionTable = ({
  userPermission,
  selectedRoleId = "",
  refetchPermission,
}: Props) => {
  const { userInfo } = useAppSelector((state) => state.auth);
  // const isAllowUpdatePermission = useMemo(() => userInfo?.role?.name === process.env.NEXT_PUBLIC_SUPER_ADMIN_ROLE_NAME, [userInfo]);
  const isAllowUpdatePermission = true;
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const { notificationApi } = useNotification();
  const { data: permissionsData } = useQuery({
    queryKey: ["permissions"],
    queryFn: () =>
      permissionService.getPermissionList({
        is_get_all: true,
        page: 1,
        limit: 1000,
      }),
  });
  return (
    <div>
      <div className="grid grid-cols-5 gap-4 text-center">
        <span></span>
        {Object.values(PERMISSION_TYPE).map((type) => (
          <span className="font-bold capitalize" key={type}>
            {type}
          </span>
        ))}
      </div>
      <div className="mt-4 flex w-full flex-col gap-4">
        {permissionsData?.data?.map((permission) => {
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
              role_id: role_id || selectedRoleId || "",
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

              refetchPermission && refetchPermission();
            }
          };
          return (
            <div key={id} className="grid grid-cols-5 gap-4">
              <span className="self-center font-bold capitalize">{type}</span>
              {allow_create ? (
                <Button
                  variant="outlined"
                  className="border-2 border-green-500 text-green-500"
                  onClick={() => handleUpdatePermission(PERMISSION_TYPE.CREATE)}
                  disabled={!isAllowUpdatePermission}
                >
                  Active
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  className="border-2 border-red-500 text-red-500"
                  onClick={() => handleUpdatePermission(PERMISSION_TYPE.CREATE)}
                  disabled={!isAllowUpdatePermission}
                >
                  Inactive
                </Button>
              )}
              {allow_delete ? (
                <Button
                  variant="outlined"
                  className="border-2 border-green-500 text-green-500"
                  onClick={() => handleUpdatePermission(PERMISSION_TYPE.DELETE)}
                  disabled={!isAllowUpdatePermission}
                >
                  Active
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  className="border-2 border-red-500 text-red-500"
                  onClick={() => handleUpdatePermission(PERMISSION_TYPE.DELETE)}
                  disabled={!isAllowUpdatePermission}
                >
                  Inactive
                </Button>
              )}
              {allow_read ? (
                <Button
                  variant="outlined"
                  className="border-2 border-green-500 text-green-500"
                  onClick={() => handleUpdatePermission(PERMISSION_TYPE.VIEW)}
                  disabled={!isAllowUpdatePermission}
                >
                  Active
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  className="border-2 border-red-500 text-red-500"
                  onClick={() => handleUpdatePermission(PERMISSION_TYPE.VIEW)}
                  disabled={!isAllowUpdatePermission}
                >
                  Inactive
                </Button>
              )}
              {allow_update ? (
                <Button
                  variant="outlined"
                  className="border-2 border-green-500 text-green-500"
                  onClick={() => handleUpdatePermission(PERMISSION_TYPE.UPDATE)}
                  disabled={!isAllowUpdatePermission}
                >
                  Active
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  className="border-2 border-red-500 text-red-500"
                  onClick={() => handleUpdatePermission(PERMISSION_TYPE.UPDATE)}
                  disabled={!isAllowUpdatePermission}
                >
                  Inactive
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionTable;
