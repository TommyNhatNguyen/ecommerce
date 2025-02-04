
import { Button, Card, Empty, Tooltip } from "antd";
import { PlusIcon } from "lucide-react";
import React from "react";

type DataCardPropsType<T> = {
  data: T[];
  handleOpenCreateModal: () => void;
  renderComponent: (item: T[]) => React.ReactNode;
  isModalCreateOpen: boolean;
  handleCloseModalCreate: () => void;
  refetch: () => void;
  updateId: string;
  isModalUpdateOpen: boolean;
  handleCloseModalUpdate: () => void;
  renderCreateModal: (
    isModalCreateOpen: boolean,
    handleCloseModalCreate: () => void,
    refetch?: () => void,
  ) => React.ReactNode;
  renderUpdateModal: (
    isModalUpdateOpen: boolean,
    handleCloseModalUpdate: () => void,
    updateId: string,
    refetch?: () => void,
  ) => React.ReactNode;
  title: string;
};

const DataCard = <T,>({
  data,
  title,
  isModalCreateOpen,
  isModalUpdateOpen,
  updateId,
  handleOpenCreateModal,
  handleCloseModalCreate,
  handleCloseModalUpdate,
  refetch,
  renderComponent,
  renderCreateModal,
  renderUpdateModal,
}: DataCardPropsType<T>) => {
  const _onOpenCreateModel = () => {
    handleOpenCreateModal();
  };
  const _onCloseModalCreate = () => {
    handleCloseModalCreate();
  };
  const _onCloseModalUpdate = () => {
    handleCloseModalUpdate();
  };
  const _onRefetch = () => {
    refetch();
  };
  return (
    <>
      <Card
        title={title}
        className="h-full max-h-[300px] flex-1 overflow-y-auto"
        extra={
          <Button
            type="primary"
            className="flex items-center gap-2"
            onClick={_onOpenCreateModel}
          >
            <PlusIcon className="h-4 w-4" />
            Add new
          </Button>
        }
      >
        {renderComponent(data)}
        {data && data.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <Empty description="No data found" />
          </div>
        )}
      </Card>
      {renderCreateModal(
        isModalCreateOpen,
        _onCloseModalCreate,
        _onRefetch,
      )}
      {renderUpdateModal(
        isModalUpdateOpen,
        _onCloseModalUpdate,
        updateId,
        _onRefetch,
      )}
    </>
  );
};

export default DataCard;
