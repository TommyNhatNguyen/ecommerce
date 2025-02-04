import DataCard from '@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard';
import { useProducts } from '@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProduct';
import { ButtonDeleteWithPopover } from '@/app/shared/components/Button';
import CreateProductModal from '@/app/shared/components/GeneralModal/components/CreateProductModal';
import UpdateProductModal from '@/app/shared/components/GeneralModal/components/UpdateProductModal';
import { productService } from '@/app/shared/services/products/productService';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Button, Tooltip, Tree } from 'antd';
import { Pencil } from 'lucide-react';
import React, { useState } from 'react'

type ProductCardPropsType = {}

const ProductCard = ({
}: ProductCardPropsType) => {
  const [isModalCreateProductOpen, setIsModalCreateProductOpen] =
    useState(false);
  const [isModalUpdateProductOpen, setIsModalUpdateProductOpen] =
    useState(false);
  const [updateProductId, setUpdateProductId] = useState<string>("");
  const { loadingSoftDelete: deleteProductLoading, handleSoftDeleteProduct } =
    useProducts();
  const {
    data: products,
    isLoading: isLoadingProducts,
    refetch,
  } = useQuery({
    queryKey: ["products", deleteProductLoading],
    queryFn: () =>
      productService.getProducts({
        includeVariant: true,
        includeVariantInfo: true,
        includeVariantInventory: true,
      }),
    placeholderData: keepPreviousData,
  });
  
  const _onSoftDeleteProduct = async (id: string) => {
    await handleSoftDeleteProduct(id);
  };
  const _onOpenModalUpdateProduct = (id: string) => {
    setUpdateProductId(id);
    setIsModalUpdateProductOpen(true);
  };
  const handleCloseModalUpdateProduct = () => {
    setIsModalUpdateProductOpen(false);
  };
  const _onOpenModalCreateProduct = () => {
    setIsModalCreateProductOpen(true);
  };

  const handleCloseModalCreateProduct = () => {
    setIsModalCreateProductOpen(false);
  }; 
  return (
    <DataCard
        title="Product"
        data={products?.data || []}
        isModalCreateOpen={isModalCreateProductOpen}
        isModalUpdateOpen={isModalUpdateProductOpen}
        updateId={updateProductId}
        handleOpenCreateModal={_onOpenModalCreateProduct}
        handleCloseModalCreate={handleCloseModalCreateProduct}
        handleCloseModalUpdate={handleCloseModalUpdateProduct}
        refetch={refetch}
        renderComponent={(data) => (
          <Tree
            treeData={data.map((item) => ({
              title: () => {
                return (
                  <Tooltip title={item.description} className="font-semibold">
                    <p>
                      {item.name} - {item.variant?.length} variants
                    </p>
                  </Tooltip>
                );
              },
              key: item.id,
              children: item.variant?.map((variant) => ({
                title: () => (
                  <Tooltip
                    title={() => {
                      return (
                        <div>
                          <p>
                            <span className="font-semibold">
                              Items in stock:
                            </span>{" "}
                            {variant.product_sellable?.inventory?.quantity || 0}{" "}
                          </p>
                          <p>
                            <span className="font-semibold">Stock status:</span>{" "}
                            {variant.product_sellable?.inventory
                              ?.stock_status || 0}{" "}
                          </p>
                        </div>
                      );
                    }}
                    className="flex items-center gap-2"
                  >
                    <span>{variant.name}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="text"
                        className="aspect-square rounded-full p-0"
                        onClick={() => _onOpenModalUpdateProduct(item.id)}
                      >
                        <Pencil className="h-4 w-4 stroke-yellow-500" />
                      </Button>
                      <ButtonDeleteWithPopover
                        title={`Delete ${item.name}?`}
                        trigger={"click"}
                        handleDelete={() => {
                          _onSoftDeleteProduct(item.id);
                        }}
                        isWithDeleteConfirmPopover={false}
                      />
                    </div>
                  </Tooltip>
                ),
                key: variant.id,
              })),
            }))}
          />
        )}
        renderCreateModal={(
          isModalCreateOpen,
          handleCloseModalCreate,
          refetch,
        ) => (
          <CreateProductModal
            isModalCreateProductOpen={isModalCreateOpen}
            handleCloseModalCreateProduct={handleCloseModalCreate}
            refetch={refetch}
          />
        )}
        renderUpdateModal={(
          isModalUpdateOpen,
          handleCloseModalUpdate,
          updateId,
          refetch,
        ) => (
          <UpdateProductModal
            isModalUpdateProductOpen={isModalUpdateOpen}
            handleCloseModalUpdateProduct={handleCloseModalUpdate}
            updateProductId={updateId}
            refetch={refetch}
          />
        )}
      />
  )
}

export default ProductCard