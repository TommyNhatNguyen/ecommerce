"use client";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { statusOptions } from "@/app/constants/seeds";
import { cn } from "@/app/shared/utils/utils";
import { User } from "@/app/shared/models/user/user.model";
import { userService } from "@/app/shared/services/user/userService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Avatar, Button, Image, Select, Table, TableProps } from "antd";
import React, { useState } from "react";
import ActionGroup from "@/app/shared/components/ActionGroup";
import { roleService } from "@/app/shared/services/role/roleService";
import { AArrowDown, Plus } from "lucide-react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useUser } from "@/app/(dashboard)/admin/(content)/permissions/user/hooks/useUser";
import CreateUserModal from "@/app/(dashboard)/admin/(content)/permissions/user/components/CreateUserModal";
import { defaultImage } from "@/app/shared/resources/images/default-image";

type UserPagePropsType = {};

const UserPage = ({}: UserPagePropsType) => {
  const [isOpenCreateUserModal, setIsOpenCreateUserModal] = useState(false);
  const {
    isCreateUserLoading,
    handleUpdateUserStatus,
    handleUpdateUserRole,
    handleDeleteUser,
    handleCreateUser,
  } = useUser();
  const { data: userData, refetch: refetchUserData } = useQuery({
    queryKey: ["user-info", isCreateUserLoading],
    queryFn: () =>
      userService.getUserList({ is_get_all: true, include_image: true }),
    placeholderData: keepPreviousData,
    enabled: !isCreateUserLoading,
  });
  const { data: roleData } = useQuery({
    queryKey: ["role-info"],
    queryFn: () => roleService.getRoleList({ is_get_all: true }),
  });
  const _onUpdateUserStatus = async (id: string, status: ModelStatus) => {
    handleUpdateUserStatus(id, status);
    refetchUserData();
  };
  const _onUpdateUserRole = async (id: string, role_id: string) => {
    handleUpdateUserRole(id, role_id);
    refetchUserData();
  };
  const _onDeleteUser = async (id: string) => {
    handleDeleteUser(id);
    refetchUserData();
  };
  const _onOpenAddNewUserModal = () => {
    setIsOpenCreateUserModal(true);
  };
  const _onCloseAddNewUserModal = () => {
    setIsOpenCreateUserModal(false);
  };
  const columns: TableProps<User>["columns"] = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, { image }) => {
        return <Avatar src={image?.url || defaultImage} size={50} />;
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_, { role_id, id }) => {
        const role = roleData?.data.find((r) => r.id === role_id);
        return (
          <Select
            className="w-full"
            options={roleData?.data.map((r) => ({
              label: r.name,
              value: r.id,
            }))}
            value={role?.name}
            disabled={!!!role?.name}
            onChange={(value) => {
              _onUpdateUserRole(id, value as string);
            }}
          />
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
              _onUpdateUserStatus(id, value as ModelStatus);
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
            _onDeleteUser(id);
          }}
        />
      ),
    },
  ];
  return (
    <div className="rounded-lg bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-md font-semibold">User table</h3>
        <Button type="primary" icon={<Plus />} onClick={_onOpenAddNewUserModal}>
          Add new user
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={userData?.data}
        pagination={false}
        tableLayout="auto"
        rowKey={(record) => record.id}
        scroll={{
          x: "w-fit",
        }}
      />
      <CreateUserModal
        isOpen={isOpenCreateUserModal}
        onClose={_onCloseAddNewUserModal}
        loading={isCreateUserLoading}
        handleCreateUser={handleCreateUser}
      />
    </div>
  );
};

export default UserPage;
