"use client";
import EmployeePermission from "@/app/(dashboard)/admin/(content)/permissions/components/EmployeePermission";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useAppDispatch, useAppSelector } from "@/app/shared/hooks/useRedux";
import { permissionService } from "@/app/shared/services/permission/permissionService";
import { roleService } from "@/app/shared/services/role/roleService";
import { getUserInfo } from "@/app/shared/store/reducers/auth";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button, Divider } from "antd";
import React, { useMemo, useState } from "react";
import update from "immutability-helper";
import { PermissionUpdateDTO } from "@/app/shared/interfaces/permission/permission.dto";
import PermissionTable from "@/app/(dashboard)/admin/(content)/permissions/components/PermissionTable";

type Props = {};

export default function PermissionPage() {
  const dispatch = useAppDispatch();
  const { userPermission, userInfo } = useAppSelector((state) => state.auth);
  return (
    <div className="rounded-lg bg-white px-4 py-2">
      <h3 className="text-lg font-bold text-blue-600">My Permission</h3>
      <PermissionTable
        userPermission={userPermission}
        selectedRoleId={userInfo?.role_id || ""}
        refetchPermission={() => dispatch(getUserInfo())}
      />
      <Divider />
      <EmployeePermission />
    </div>
  );
}
