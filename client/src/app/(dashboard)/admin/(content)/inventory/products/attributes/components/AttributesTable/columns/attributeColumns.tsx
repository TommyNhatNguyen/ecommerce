import { IntlShape } from "react-intl";
import { ColorPicker, TableProps, Tag, Button } from "antd";
import {
  OptionModel,
  OptionValueModel,
} from "@/app/shared/models/variant/variant.model";
import { Edit, Edit2Icon } from "lucide-react";

export const optionsColumns: (
  intl: IntlShape,
  onEdit: (id: string) => void,
) => TableProps<OptionModel>["columns"] = (
  intl: IntlShape,
  onEdit: (id: string) => void,
) => [
  {
    key: "name",
    title: () => intl.formatMessage({ id: "attribute_name" }),
    dataIndex: "name",
  },
  {
    key: "label",
    title: () => intl.formatMessage({ id: "attribute_label" }),
    dataIndex: "label",
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
  {
    key: "action",
    title: () => intl.formatMessage({ id: "action" }),
    dataIndex: "action",
    render: (_, { id }) => {
      return (
        <Button
          type="link"
          variant="link"
          color="yellow"
          icon={<Edit2Icon width={16} height={16} />}
          onClick={() => onEdit(id)}
        />
      );
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
    title: () => intl.formatMessage({ id: "attribute_name" }),
    dataIndex: "name",
  },
  {
    key: "value",
    title: () => intl.formatMessage({ id: "value" }),
    dataIndex: "value",
    render: (_, { is_color, value }) => {
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
    render: (_, { status }) => {
      return (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>
          {intl.formatMessage({ id: status })}
        </Tag>
      );
    },
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
