import { IntlShape } from "react-intl";
import { Image, TableProps } from "antd";
import { BrandModel } from "@/app/shared/models/brands/brands.model";
import SelectStatusAdmin from "@/app/shared/components/SelectStatusAdmin";
import { ModelStatus } from "@/app/shared/models/others/status.model";

export const brandColumns: (
  intl: IntlShape,
  onChangeStatus: (id: string, status: ModelStatus) => void,
) => TableProps<BrandModel>["columns"] = (intl, onChangeStatus) => [
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
];
