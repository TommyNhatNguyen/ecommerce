import { IntlShape } from "react-intl";
import { Image, TableProps, Tag } from "antd";
import { CategoryModel } from "@/app/shared/models/categories/categories.model";

export const categoryColumns: (
  intl: IntlShape,
) => TableProps<CategoryModel>["columns"] = (intl: IntlShape) => [
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
        <div className="max-h-[100px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: description || "" }}></div>
      );
    },
  },
  {
    key: "status",
    title: () => intl.formatMessage({ id: "status" }),
    dataIndex: "status",
    render: (_, { status }) => {
      return (
        <div>
          {status === "ACTIVE" ? (
            <Tag color="green">{intl.formatMessage({ id: status })}</Tag>
          ) : (
            <Tag color="red">{intl.formatMessage({ id: status })}</Tag>
          )}
        </div>
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
