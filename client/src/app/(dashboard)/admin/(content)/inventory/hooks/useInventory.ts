import { useNotification } from "@/app/contexts/NotificationContext";
import { UpdateProductDTO } from "@/app/shared/interfaces/products/product.dto";
import { VariantUpdateDTO } from "@/app/shared/interfaces/variant/variant.interface";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { productService } from "@/app/shared/services/products/productService";
import { variantServices } from "@/app/shared/services/variant/variantService";
import { useState } from "react";
export function useInventory() {
  const [selectedRows, setSelectedRows] = useState<ProductModel[]>([]);
  const [softDeleteProductLoading, setSoftDeleteProductLoading] =
    useState(false);
  const [deleteVariantLoading, setDeleteVariantLoading] = useState(false);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [updateVariantStatusLoading, setUpdateVariantStatusLoading] =
    useState(false);
  const [
    softDeleteSelectedProductsLoading,
    setSoftDeleteSelectedProductsLoading,
  ] = useState(false);

  const { notificationApi } = useNotification();

  const handleSoftDeleteProduct = async (
    id: string,
    isBulkDelete: boolean = false,
  ) => {
    try {
      !isBulkDelete && setSoftDeleteProductLoading(true);
      const response = await productService.softDeleteProduct(id);
      if (response) {
        notificationApi.success({
          message: "Product deleted successfully",
          description: "Product deleted successfully",
        });
        return response;
      }
      notificationApi.error({
        message: "Failed to delete product",
        description: "Failed to delete product",
      });
      return null;
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: "Failed to delete product",
        description: "Failed to delete product",
      });
      return null;
    } finally {
      !isBulkDelete && setSoftDeleteProductLoading(false);
    }
  };
  const handleSelectAllRow = (
    selected: boolean,
    selectedRows: ProductModel[],
    changeRows: ProductModel[],
  ) => {
    setSelectedRows(selectedRows);
  };
  const handleSelectRow = (
    record: ProductModel,
    selected: boolean,
    selectedRows: ProductModel[],
  ) => {
    setSelectedRows(selectedRows);
  };
  const handleSoftDeleteSelectedProducts = async () => {
    if (selectedRows.length === 0) return;
    try {
      setSoftDeleteSelectedProductsLoading(true);
      await Promise.all(
        selectedRows.map(
          async (item) => await handleSoftDeleteProduct(item.id, true),
        ),
      );
      setSelectedRows([]);
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: "Failed to delete product",
        description: "Failed to delete product",
      });
    } finally {
      setSoftDeleteSelectedProductsLoading(false);
    }
    setSelectedRows([]);
  };
  const handleDeleteVariant = async (id: string) => {
    setDeleteVariantLoading(true);
    try {
      const response = await variantServices.delete(id);
      if (response) {
        notificationApi.success({
          message: "Variant deleted successfully",
          description: "Variant deleted successfully",
        });
        return response;
      }
      return false;
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: "Failed to delete variant",
        description: "Failed to delete variant",
      });
      return false;
    } finally {
      setDeleteVariantLoading(false);
    }
  };
  const handleClearAllSelectedRows = () => {
    setSelectedRows([]);
  };
  const handleUpdateStatus = async (id: string, status: ModelStatus) => {
    setUpdateStatusLoading(true);
    const payload: UpdateProductDTO = {
      status,
    };
    try {
      const response = await productService.updateProduct(id, payload);
      if (response) {
        notificationApi.success({
          message: "Product status updated successfully",
          description: "Product status updated successfully",
        });
        return true;
      }
      notificationApi.error({
        message: "Failed to update product status",
        description: "Failed to update product status",
      });
      return false;
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: "Failed to update product status",
        description: "Failed to update product status",
      });
      return false;
    } finally {
      setUpdateStatusLoading(false);
    }
  };
  const handleUpdateVariantStatus = async (id: string, status: ModelStatus) => {
    setUpdateVariantStatusLoading(true);
    try {
      const response = await variantServices.updateStatus(id, status);
      if (response) {
        notificationApi.success({
          message: "Variant status updated successfully",
          description: "Variant status updated successfully",
        });
      }
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: "Failed to update variant status",
        description: "Failed to update variant status",
      });
    } finally {
      setUpdateVariantStatusLoading(false);
    }
  };
  const inventoryOverallProps = {};
  const inventoryTableProps = {
    selectedRows,
    handleSelectAllRow,
    handleSelectRow,
    handleClearAllSelectedRows,
    handleSoftDeleteProduct,
    softDeleteProductLoading,
    handleUpdateStatus,
    updateStatusLoading,
    handleSoftDeleteSelectedProducts,
    softDeleteSelectedProductsLoading,
    handleUpdateVariantStatus,
    updateVariantStatusLoading,
    handleDeleteVariant,
    deleteVariantLoading,
  };
  return {
    inventoryOverallProps,
    inventoryTableProps,
  };
}
