import { cn } from "@/app/shared/utils/utils";
import { Button, Input, InputProps } from "antd";
import { SearchProps } from "antd/es/input";
import { ChevronDown } from "lucide-react";
import React, { forwardRef, useState } from "react";
import { useIntl } from "react-intl";

type Props = {
  children: React.ReactNode;
} & React.RefAttributes<HTMLDivElement>;

type FilterItemProps = {
  children: React.ReactNode;
  name: string;
  label?: string | React.ReactNode;
  wrapperClassName?: string;
};

interface FilterComponent extends React.ForwardRefExoticComponent<Props> {
  Item: React.FC<FilterItemProps>;
}

const Filter = (
  { children, ...props }: Props,
  ref?: React.Ref<HTMLDivElement>,
) => {
  return (
    <div className="sticky top-10" ref={ref}>
      {children}
      {/* Clear all */}
      {/* Collapse */}
    </div>
  );
};

const FilterComponent = forwardRef(Filter) as FilterComponent;

FilterComponent.Item = ({
  children,
  wrapperClassName,
  label,
  ...props
}: FilterItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={cn(
        "mb-4 rounded-sm border border-solid border-neutral-100 bg-neutral-50 p-2 transition-all duration-300",
        isOpen && "max-h-[48px] overflow-hidden",
        wrapperClassName,
      )}
    >
      {label && (
        <div className="mb-2 flex items-center justify-between pl-1">
          <div className="font-roboto-medium text-sm">{label}</div>
          <Button
            type="text"
            variant="text"
            icon={<ChevronDown width={16} height={16} />}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(isOpen && "rotate-180")}
          />
        </div>
      )}
      {children}
    </div>
  );
};

export default FilterComponent;
