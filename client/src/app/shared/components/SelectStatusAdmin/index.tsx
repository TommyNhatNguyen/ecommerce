import { STATUS_OPTIONS } from "@/app/constants/seeds";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { Select } from "antd";
import React from "react";
import { useIntl } from "react-intl";

type Props = {
  handleChangeStatus: (id: string, status: ModelStatus) => void;
  status: ModelStatus;
  id: string;
  customLabel?: {
    active: string;
    inactive: string;
  };
};

const SelectStatusAdmin = ({
  handleChangeStatus,
  status,
  id,
  customLabel = {
    active: "is_selling",
    inactive: "is_discountinued",
  },
}: Props) => {
  const intl = useIntl();
  return (
    <Select
      options={STATUS_OPTIONS}
      value={status}
      onChange={(value) => handleChangeStatus(id, value as ModelStatus)}
      className="w-full"
      optionRender={(props) => {
        const color = props.value === "ACTIVE" ? "green" : "red";
        const label =
          props.value === "ACTIVE" ? customLabel?.active : customLabel?.inactive;
        return (
          <p className="text-sm" style={{ color }}>
            {intl.formatMessage({ id: label })}
          </p>
        );
      }}
      labelRender={(props) => {
        const color = props.value === "ACTIVE" ? "green" : "red";
        const label =
          props.value === "ACTIVE" ? customLabel?.active : customLabel?.inactive;
        return (
          <p className="text-sm" style={{ color }}>
            {intl.formatMessage({ id: label })}
          </p>
        );
      }}
    />
  );
};

export default SelectStatusAdmin;
