import { cn } from "@/app/shared/utils/utils";
import { Checkbox } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { useIntl } from "react-intl";
import { ClassNameValue } from "tailwind-merge";
type Props = {
  selectedData: string[];
  onSelect: (value: string[]) => void;
  isSelectAll?: boolean;
  wrapperClassName?: ClassNameValue;
  data?: {
    label: string;
    value: string;
  }[];
} & CheckboxGroupProps;

const CustomCheckboxGroup = ({
  selectedData,
  data,
  onSelect,
  isSelectAll = true,
  wrapperClassName,
  ...props
}: Props) => {
  const intl = useIntl();
  const indeterminate =
    selectedData?.length > 0 && selectedData?.length < (data?.length || 0);
  const checkAll = selectedData?.length === (data?.length || 0);
  const _onSelect = (value: string[]) => {
    onSelect(value);
  };
  const _onSelectAll = () => {
    if (checkAll) {
      onSelect([]);
    } else {
      onSelect(data?.map((item) => item.value) || []);
    }
  };
  return (
    <div className={cn(wrapperClassName)}>
      {isSelectAll && (
        <Checkbox
          indeterminate={indeterminate}
          onChange={_onSelectAll}
          checked={checkAll}
        >
          {intl.formatMessage({ id: "check_all" })}
        </Checkbox>
      )}
      <Checkbox.Group
        options={
          data?.map((item) => ({
            label: item.label,
            value: item.value,
          })) || []
        }
        value={selectedData}
        onChange={_onSelect}
        {...props}
      />
    </div>
  );
};

export default CustomCheckboxGroup;
