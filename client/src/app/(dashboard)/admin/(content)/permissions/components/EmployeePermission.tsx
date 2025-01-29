"use client";
import { roleService } from "@/app/shared/services/role/roleService";
import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import React from "react";

type Props = {};

const EmployeePermission = (props: Props) => {
  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      roleService.getRoleList({ is_get_all: true, page: 1, limit: 1000 }),
  });
  return (
    <div>
      <Select
        options={rolesData?.data.map((role) => ({
          label: role.name,
          value: role.id,
        }))}
        placeholder="Choose a role to assign permission"
      />
    </div>
  );
};

export default EmployeePermission;
