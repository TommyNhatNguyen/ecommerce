import { IntlShape } from "react-intl";
import { Button, Image, TableProps, Tag } from "antd";
import { CategoryModel } from "@/app/shared/models/categories/categories.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import SelectStatusAdmin from "@/app/shared/components/SelectStatusAdmin";
import { Pencil, Trash2Icon } from "lucide-react";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";

const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button
    icon={<Trash2Icon width={16} height={16} />}
    type="link"
    variant="link"
    color="danger"
  ></Button>,
);

export const categoryColumns: (
  intl: IntlShape,
  onChangeStatus: (id: string, status: ModelStatus) => void,
  handleSelectUpdateItem: (id: string) => void,
  handleDelete: (id: string) => void,
) => TableProps<CategoryModel>["columns"] = (
  intl,
  onChangeStatus,
  handleSelectUpdateItem,
  handleDelete,
) => [
  {
    key: "image",
    title: () => intl.formatMessage({ id: "thumbnail" }),
    render: (_, { image }) => {
      return <Image src={image?.url} width={50} height={50} />;
    },
    dataIndex: "image",
  },
  {
    key: "name",
    title: () => intl.formatMessage({ id: "name" }),
    dataIndex: "name",
  },
  {
    key: "description",
    title: () => intl.formatMessage({ id: "description" }),
    dataIndex: "description",
    render: (_, { description }) => {
      return (
        <div
          className="max-h-[100px] overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: description || "" }}
        ></div>
      );
    },
  },
  {
    key: "status",
    title: () => intl.formatMessage({ id: "status" }),
    dataIndex: "status",
    render: (_, { status, id }) => {
      return (
        <SelectStatusAdmin
          handleChangeStatus={onChangeStatus}
          status={status}
          id={id || ""}
        />
      );
    },
  },
  {
    key: "created_at",
    title: () => intl.formatMessage({ id: "created_at" }),
    dataIndex: "created_at",
    render: (_, { created_at }) => {
      return <span>{created_at}</span>;
    },
  },
  {
    key: "updated_at",
    title: () => intl.formatMessage({ id: "updated_at" }),
    dataIndex: "updated_at",
    render: (_, { updated_at }) => {
      return <span>{updated_at}</span>;
    },
  },
  {
    key: "action",
    title: () => intl.formatMessage({ id: "actions" }),
    dataIndex: "action",
    render: (_, { id}) => {
      return (
        <div className="flex items-center gap-2">
          <ButtonDeleteWithPopover
            trigger={"click"}
            handleDelete={() => {
              handleDelete(id);
            }}
            isWithDeleteConfirmPopover={false}
          />
          <Button
            type="link"
            variant="link"
            color="primary"
            icon={<Pencil width={16} height={16} />}
            onClick={() => handleSelectUpdateItem(id)}
          ></Button>
        </div>
      );
    },
  },
];
