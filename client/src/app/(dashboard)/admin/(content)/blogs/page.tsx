"use client";
import { useBlog } from "@/app/(dashboard)/admin/(content)/blogs/hooks/useBlog";
import { STATUS_OPTIONS } from "@/app/constants/seeds";
import { cn } from "@/app/shared/utils/utils";
import { IBlogs } from "@/app/shared/models/blogs/blogs.model";
import { Image, Select, Table, TableProps } from "antd";
import React from "react";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { getDateFormat } from "@/app/shared/utils/datetime";
import { formatDate } from "date-fns";
import ActionGroup from "@/app/shared/components/ActionGroup";

type Props = {};

const BlogsPage = (props: Props) => {
  const {
    blogsData,
    limit,
    total_count,
    current_page,
    updateStatusLoading,
    isBlogsLoading,
    setBlogsPage,
    setBlogsLimit,
    handleUpdateStatus,
    handleSoftDeleteBlog,
  } = useBlog();
  const _onSelectStatus = async (status: ModelStatus, id: string) => {
    await handleUpdateStatus(id, status);
  };
  const _onSoftDeleteProduct = async (id: string) => {
    await handleSoftDeleteBlog(id);
  };
  const _onOpenModalUpdateProduct = (id: string) => {
    console.log(id);
  };
  const blogColumns: TableProps<IBlogs>["columns"] = [
    {
      title: "Thumbnail",
      dataIndex: "thumnail_url",
      key: "thumnail_url",
      className: "max-w-[150px]",
      minWidth: 150,
      render: (_, { thumnail_url }) => {
        return <Image src={thumnail_url} alt="thumbnail" />;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Short description",
      dataIndex: "short_description",
      key: "short_description",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      filters: STATUS_OPTIONS.map((option) => ({
        text: option.label,
        value: option.value,
      })),
      onFilter: (value, record) => record.status === value,
      render: (_, { status, id }) => {
        return (
          <Select
            options={STATUS_OPTIONS}
            defaultValue={status}
            onSelect={(value) => {
              _onSelectStatus(value, id);
            }}
            disabled={updateStatusLoading}
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
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, { created_at }) => {
        return <span>{created_at}</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, { id }) => (
        <ActionGroup
          isWithDeleteConfirmPopover={false}
          deleteConfirmPopoverProps={{
            title: "Are you sure you want to delete this product?",
          }}
          handleDelete={() => {
            _onSoftDeleteProduct(id);
          }}
          handleEdit={() => {
            _onOpenModalUpdateProduct(id);
          }}
        />
      ),
    },
  ];
  return (
    <Table
      dataSource={blogsData}
      columns={blogColumns}
      rowKey={(record) => record.id}
      loading={isBlogsLoading}
      size="small"
      tableLayout="auto"
      scroll={{ x: "100%" }}
      pagination={{
        current: current_page,
        pageSize: limit,
        total: total_count,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 30, 40, 50, Number(total_count)],
        onChange: (page, pageSize) => {
          setBlogsPage(page);
          setBlogsLimit(pageSize);
        },
      }}
    />
  );
};

export default BlogsPage;
