import GeneralModal, { ModalRefType } from '@/app/shared/components/GeneralModal';
import { productService } from '@/app/shared/services/products/productService'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Button } from 'antd';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { useIntl } from 'react-intl';

type Props = {
  handleCreateVariant: (data: any) => void;
  loading?: boolean;
  refetch?: () => void;
}

const ModalCreateVariant = ({ handleCreateVariant, loading = false, refetch }: Props,
  ref: any,) => {
    const intl = useIntl();
    const [open, setOpen] = useState(true);
  const { data: productData, fetchNextPage, hasNextPage, isFetchingNextPage,  isLoading } = useInfiniteQuery({
    queryKey: ['products-infinite'],
    queryFn: ({ pageParam = 1 }) => {
      return productService.getProducts({
        page: pageParam,
        limit: 10,
      })
    },
    getNextPageParam: (lastPage) => {
      return lastPage.meta.total_page > lastPage.meta.current_page
        ? lastPage.meta.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
  })
  const products = useMemo(() => {
    return productData?.pages?.flatMap((page) => page.data) || [];
  }, [productData]);
  console.log("🚀 ~ products ~ products:", products)
  const handleOpenModal = () => {
    setOpen(true);
  };
  const _onCloseModal = () => {
    setOpen(false);
  };

  useImperativeHandle<ModalRefType, ModalRefType>(ref, () => ({
    handleOpenModal,
    handleCloseModal: _onCloseModal,
  }));

  const _onConfirmCreateVariant = async (data: any) => {
    handleCreateVariant(data);
    _onCloseModal();
    // reset();
    // setValue("description", "");
    refetch?.();
  };

  const _renderTitle = () => {
    return (
      <h1 className="text-2xl font-bold">
        {intl.formatMessage({ id: "create_warehouse" })}
      </h1>
    );
  };

  const _renderContent = () => {
    return <div>
      {/* Chọn sản phẩm id */}
      {/* Làm giống modal product */}
    </div>;
  }
  const _renderFooter = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModal}>
          {intl.formatMessage({ id: "close" })}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          // onClick={handleSubmit(_onConfirmCreateVariant)}
        >
          {intl.formatMessage({ id: "add_new" })}
        </Button>
      </div>
    );
  }
  return (
    <GeneralModal
      open={open}
      renderTitle={_renderTitle}
      renderContent={_renderContent}
      renderFooter={_renderFooter}
      onCancel={_onCloseModal}
      loading={loading}
    />
  );
}

export default React.memo(forwardRef<ModalRefType, Props>(ModalCreateVariant));