import { IntlShape } from "react-intl";
import { ColorPicker, TableProps, Tag } from "antd";
import {
  OptionModel,
  OptionValueModel,
} from "@/app/shared/models/variant/variant.model";

export const optionsColumns: (
  intl: IntlShape,
) => TableProps<OptionModel>["columns"] = (intl: IntlShape) => [
  {
    key: "name",
    title: () => intl.formatMessage({ id: "name" }),
    dataIndex: "name",
  },
  {
    key: "is_color",
    title: () => intl.formatMessage({ id: "color" }),
    dataIndex: "color",
    render: (_, { is_color }) => {
      return (
        <span>
          {is_color
            ? intl.formatMessage({ id: "yes" })
            : intl.formatMessage({ id: "no" })}
        </span>
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

export const optionsValuesColumns: (
  intl: IntlShape,
) => TableProps<OptionValueModel & { is_color: boolean }>["columns"] = (
  intl: IntlShape,
) => [
  {
    key: "name",
    title: () => intl.formatMessage({ id: "name" }),
    dataIndex: "name",
  },
  {
    key: "is_color",
    title: () => intl.formatMessage({ id: "color" }),
    dataIndex: "is_color",
    render: (_, { is_color, value, name }) => {
      return (
        <div>
          {is_color ? (
            <div className="flex items-center gap-2">
              <ColorPicker value={value} disabled />
              <span>{value}</span>
            </div>
          ) : (
            <span>{value}</span>
          )}
        </div>
      );
    },
  },
  {
    key: "status",
    title: () => intl.formatMessage({ id: "status" }),
    dataIndex: "status",
  },
  {
    key: "created_at",
    title: () => intl.formatMessage({ id: "created_at" }),
    dataIndex: "created_at",
  },
  {
    key: "updated_at",
    title: () => intl.formatMessage({ id: "updated_at" }),
    dataIndex: "updated_at",
  },
];
