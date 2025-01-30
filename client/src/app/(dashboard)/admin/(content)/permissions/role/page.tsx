"use client";
import CreateRoleModal from "@/app/(dashboard)/admin/(content)/permissions/role/components/CreateRoleModal";
import { useRole } from "@/app/(dashboard)/admin/(content)/permissions/role/hooks/useRole";
import { statusOptions } from "@/app/constants/seeds";
import ActionGroup from "@/app/shared/components/ActionGroup";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { Role } from "@/app/shared/models/role/role.model";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import { roleService } from "@/app/shared/services/role/roleService";
import { cn } from "@/app/shared/utils/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Avatar, Button, Select, Table, TableProps, Tooltip } from "antd";
import { Plus } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const RolePage = (props: Props) => {
  const {
    handleChangeRoleStatus,
    handleDeleteRole,
    handleCreateRole,
    isChangeStatusLoading,
    isDeleteRoleLoading,
    isCreateRoleLoading,
  } = useRole();
  const [isAddNewRoleModalOpen, setIsAddNewRoleModalOpen] = useState(false);
  const { data: roleData, isLoading: roleLoading } = useQuery({
    queryKey: ["role-list", isChangeStatusLoading, isDeleteRoleLoading, isCreateRoleLoading],
    queryFn: () => roleService.getRoleList({ is_get_all: true, include_users: true }),
    placeholderData: keepPreviousData
  });
  const _onChangeRoleStatus = (role_id: string, role_status: ModelStatus) => {
    handleChangeRoleStatus(role_id, role_status);
  };
  const _onDeleteRole = (role_id: string) => {
    handleDeleteRole(role_id);
  };
  const _onOpenAddNewRoleModal = () => {
    setIsAddNewRoleModalOpen(true);
  };
  const _onCloseAddNewRoleModal = () => {
    setIsAddNewRoleModalOpen(false);
  };
  const columns: TableProps<Role>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Users",
      dataIndex: "users",
      key: "users",
      render: (_, { user }) => {
        return (
          <Avatar.Group
            max={{
              count: 2,
            }}
          >
            {user?.map((item) => (
              <Tooltip
                key={item?.id}
                title={() => (
                  <div className="flex flex-col gap-2">
                    <p>{item?.username}</p>
                    <p>{item?.email}</p>
                    <p>{item?.phone}</p>
                  </div>
                )}
              >
                <Avatar src={defaultImage} />
              </Tooltip>
            ))}
          </Avatar.Group>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      render: (_, { status, id }) => {
        return (
          <Select
            options={statusOptions}
            value={status}
            disabled={false}
            onSelect={(value) => {
              _onChangeRoleStatus(id, value as ModelStatus);
            }}
            className="min-w-[120px]"
            labelRender={(option) => {
              const textColor =
                option.value === "ACTIVE" ? "text-green-500" : "text-red-500";
              return (
                <div className={cn("font-semibold capitalize", `${textColor}`)}>
                  {option.label}
                </div>
              );
            }}
            dropdownRender={(menu) => {
              return (
                <div className="min-w-fit">
                  <div>{menu}</div>
                </div>
              );
            }}
          />
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      render: (_, { id }) => (
        <ActionGroup
          isWithDeleteConfirmPopover={false}
          deleteConfirmPopoverProps={{
            title: "Are you sure you want to delete this order?",
          }}
          handleDelete={() => {
            _onDeleteRole(id);
          }}
        />
      ),
    },
  ];
  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold">Role table</h3>
        <Button type="primary" icon={<Plus />} onClick={_onOpenAddNewRoleModal}>
          Add new role
        </Button>
      </div>
      <Table
        dataSource={roleData?.data}
        columns={columns}
        rowKey={(record) => record.id}
        tableLayout="auto"
        pagination={false}
      />
      <CreateRoleModal
        isOpen={isAddNewRoleModalOpen}
        onClose={_onCloseAddNewRoleModal}
        handleCreateRole={handleCreateRole}
        loading={isCreateRoleLoading}
      />
    </div>
  );
};

export default RolePage;
