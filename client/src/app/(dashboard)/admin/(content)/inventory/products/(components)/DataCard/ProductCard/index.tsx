import DataCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard";
import { useProducts } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProduct";
import ModalCreateProduct from "@/app/shared/components/GeneralModal/components/ModalCreateProduct";
import UpdateProductModal from "@/app/shared/components/GeneralModal/components/UpdateProductModal";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { productService } from "@/app/shared/services/products/productService";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Button, Tooltip, Tree } from "antd";
import { Pencil, Trash2Icon } from "lucide-react";
import React, { useState } from "react";

type ProductCardPropsType = {};
const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 stroke-red-500" />
  </Button>,
);
const ProductCard = ({}: ProductCardPropsType) => {
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
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", deleteProductLoading],
    queryFn: (p) =>
      productService.getProducts({
        page: p.pageParam,
        limit: 10,
        includeVariant: true,
        includeVariantInfo: true,
        includeVariantInventory: true,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page === lastPage.meta.total_page) {
        return undefined;
      }
      return lastPage.meta.current_page + 1;
    },
    initialPageParam: 1,
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
      data={products?.pages.flatMap((page) => page.data) || []}
      isModalCreateOpen={isModalCreateProductOpen}
      isModalUpdateOpen={isModalUpdateProductOpen}
      updateId={updateProductId}
      handleOpenCreateModal={_onOpenModalCreateProduct}
      handleCloseModalCreate={handleCloseModalCreateProduct}
      handleCloseModalUpdate={handleCloseModalUpdateProduct}
      refetch={refetch}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      renderComponent={(data) => (
        <Tree
          className="min-h-[100px]"
          treeData={data.map((item) => ({
            title: () => {
              return (
                <Tooltip
                  title={() => (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.description as string,
                      }}
                    ></div>
                  )}
                  className="font-semibold"
                >
                  <p>
                    {item.name} - {item.variant?.length} variants
                  </p>
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
                          <span className="font-semibold">Items in stock:</span>{" "}
                          {variant.product_sellable?.inventory?.quantity ||
                            0}{" "}
                        </p>
                        <p>
                          <span className="font-semibold">Stock status:</span>{" "}
                          {variant.product_sellable?.inventory?.stock_status ||
                            0}{" "}
                        </p>
                      </div>
                    );
                  }}
                  className="flex items-center justify-between gap-2"
                >
                  <span>{variant.name}</span>
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
        <ModalCreateProduct
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
  );
};

export default ProductCard;
