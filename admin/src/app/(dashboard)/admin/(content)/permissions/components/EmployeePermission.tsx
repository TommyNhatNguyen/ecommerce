"use client";
import PermissionTable from "@/app/(dashboard)/admin/(content)/permissions/components/PermissionTable";
import { roleService } from "@/app/shared/services/role/roleService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import React, { useEffect, useState } from "react";

type Props = {};

const EmployeePermission = (props: Props) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const _onSelectRoleId = (roleId: string) => {
    setSelectedRoleId(roleId);
  };
  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      roleService.getRoleList({
        is_get_all: true,
        page: 1,
        limit: 1000,
      }),
  });
  const {
    data: roleInfoData,
    isLoading: isLoadingRoleInfo,
    refetch: refetchRoleInfo,
  } = useQuery({
    queryKey: ["roleInfo", selectedRoleId],
    queryFn: () =>
      roleService.getRoleById(selectedRoleId || "", {
        include_permissions: true,
      }),
    enabled: !!selectedRoleId,
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (rolesData?.data.length && rolesData?.data[0].id) {
      setSelectedRoleId(rolesData?.data[0].id);
    }
  }, [rolesData]);
  return (
    <div>
      <h3 className="text-lg font-bold text-blue-600">
        Employee permission settings
      </h3>
      <div className="mt-4">
        <div className="mb-4 flex items-center gap-2">
          <h4 className="text-lg font-semibold">Select a role:</h4>
          <Select
            className="min-w-[200px]"
            options={rolesData?.data.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
            value={selectedRoleId}
            placeholder="Choose a role to assign permission"
            onChange={_onSelectRoleId}
          />
        </div>
        <PermissionTable
          userPermission={roleInfoData?.permission || []}
          selectedRoleId={selectedRoleId || ""}
          refetchPermission={refetchRoleInfo}
        />
      </div>
    </div>
  );
};

export default EmployeePermission;
