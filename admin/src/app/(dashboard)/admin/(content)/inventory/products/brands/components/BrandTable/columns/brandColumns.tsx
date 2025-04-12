import { IntlShape } from "react-intl";
import { Button, Image, TableProps } from "antd";
import { BrandModel } from "@/app/shared/models/brands/brands.model";
import SelectStatusAdmin from "@/app/shared/components/SelectStatusAdmin";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";

const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button
    icon={<Trash2Icon width={16} height={16} />}
    type="link"
    variant="link"
    color="danger"
  ></Button>,
);

export const brandColumns: (
  intl: IntlShape,
  onChangeStatus: (id: string, status: ModelStatus) => void,
  onOpenModalUpdateBrand: (id: string) => void,
  onDeleteBrand: (id: string) => void,
) => TableProps<BrandModel>["columns"] = (
  intl,
  onChangeStatus,
  onOpenModalUpdateBrand,
  onDeleteBrand,
) => [
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
          status={status}
          handleChangeStatus={onChangeStatus}
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
    key: "actions",
    title: () => intl.formatMessage({ id: "actions" }),
    dataIndex: "actions",
    render: (_, { id }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            type="link"
            variant="link"
            color="yellow"
            icon={<Edit2Icon width={16} height={16} />}
            onClick={() => onOpenModalUpdateBrand(id)}
          />
          <ButtonDeleteWithPopover
            trigger={"click"}
            handleDelete={() => onDeleteBrand(id)}
            isWithDeleteConfirmPopover={false}
          />
        </div>
      );
    },
  },
];
