import { cn } from "@/app/shared/utils/utils";
import { Button, Input, InputProps } from "antd";
import { SearchProps } from "antd/es/input";
import { ChevronDown } from "lucide-react";
import React, { forwardRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useIntl } from "react-intl";

type Props = {
  children: React.ReactNode;
  clearAll?: () => void;
  hasSelectedItems?: boolean;
} & React.RefAttributes<HTMLDivElement>;

type FilterItemProps = {
  children: React.ReactNode;
  name: string;
  label?: string | React.ReactNode;
  wrapperClassName?: string;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  refetch?: () => void;
};

interface FilterComponent extends React.ForwardRefExoticComponent<Props> {
  Item: React.FC<FilterItemProps>;
}

const Filter = (
  { children, hasSelectedItems, clearAll, ...props }: Props,
  ref?: React.Ref<HTMLDivElement>,
) => {
  const intl = useIntl();
  return (
    <div className="sticky top-10 max-h-[800px] overflow-y-auto px-4" ref={ref}>
      {hasSelectedItems && (
        <Button
          type="primary"
          className="mb-2 w-fit"
          onClick={clearAll}
        >
          {intl.formatMessage({ id: "clear_all_filters" })}
        </Button>
      )}
      {children}
    </div>
  );
};

const FilterComponent = forwardRef(Filter) as FilterComponent;

FilterComponent.Item = ({
  children,
  wrapperClassName,
  label,
  fetchNextPage,
  hasNextPage,
  refetch,
  ...props
}: FilterItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage && fetchNextPage();
    }
  }, [inView]);
  return (
    <div
      className={cn(
        "mb-4 max-h-[200px] overflow-y-auto rounded-sm border border-solid border-neutral-100 bg-neutral-50 p-2 transition-all duration-300",
        isOpen && "max-h-[48px] overflow-hidden",
        wrapperClassName,
      )}
    >
      {label && (
        <div className="mb-2 flex items-center justify-between pl-1 capitalize">
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
      <div ref={ref} className="h-2"></div>
    </div>
  );
};

export default FilterComponent;
