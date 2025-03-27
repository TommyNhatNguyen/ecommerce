import { Router } from 'express';
import {
  init,
  initProductCategory,
  productCategoryModelName,
  productModelName,
} from 'src/modules/products/infras/repo/postgres/dto';
import { Sequelize } from 'sequelize';
import { PostgresProductRepository } from 'src/modules/products/infras/repo/postgres/repo';
import { ProductUseCase } from 'src/modules/products/usecase';
import { ProductHttpService } from 'src/modules/products/infras/transport/products.http-service';
import {
  variantModelName,
  variantOptionValueModelName,
} from 'src/modules/variant/infras/repo/postgres/dto';
import { PostgresVariantRepository } from 'src/modules/variant/infras/repo/postgres/repo';
import { VariantUseCase } from 'src/modules/variant/usecase';
import {
  productSellableDiscountModelName,
  productSellableImageModelName,
  productSellableModelName,
  productSellableVariantModelName,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { PostgresProductSellableRepository } from 'src/modules/product_sellable/infras/repo/postgres/repo';
import { CloudinaryImageRepository } from 'src/modules/image/infras/repo/repo';
import cloudinary from 'src/share/cloudinary';
import { PostgresInventoryRepository } from 'src/modules/inventory/infras/repo/postgres/repo';
import {
  inventoryModelName,
  inventoryWarehouseModelName,
} from 'src/modules/inventory/infras/repo/postgres/dto';
import { InventoryUseCase } from 'src/modules/inventory/usecase';
import { DiscountUseCase } from 'src/modules/discount/usecase';
import { PostgresDiscountRepository } from 'src/modules/discount/infras/repo/postgres/discount.repo';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { ProductSellableUseCase } from 'src/modules/product_sellable/usecase';
import { PostgresWarehouseRepository } from 'src/modules/warehouse/infras/repo/warehouse.repo';
import { warehouseModelName } from 'src/modules/warehouse/infras/repo/warehouse.dto';
import { WarehouseUseCase } from 'src/modules/warehouse/usecase';
import { InventoryInvoiceUseCase } from 'src/modules/inventory_invoices/usecase';
import { InventoryInvoiceRepository } from 'src/modules/inventory_invoices/infras/repo/inventory_invoices.repo';
import { inventoryInvoiceModelName } from 'src/modules/inventory_invoices/infras/repo/inventory_invoices.dto';
import { BrandUseCase } from 'src/modules/brand/usecase';
import PostgresBrandRepository from 'src/modules/brand/infras/repo/brand.repo';
import { brandModelName } from 'src/modules/brand/infras/repo/brand.dto';

export const setupProductRouter = (sequelize: Sequelize) => {
  init(sequelize);
  initProductCategory(sequelize);
  const repository = new PostgresProductRepository(sequelize, productModelName);
  const productCategoryRepository = new PostgresProductRepository(
    sequelize,
    productCategoryModelName
  );
  const variantRepository = new PostgresVariantRepository(
    sequelize,
    variantModelName
  );
  const variantOptionValueRepository = new PostgresVariantRepository(
    sequelize,
    variantOptionValueModelName
  );

  const productSellableRepository = new PostgresProductSellableRepository(
    sequelize,
    productSellableModelName
  );
  const cloudinaryRepository = new CloudinaryImageRepository(cloudinary);
  const productSellableDiscountRepository =
    new PostgresProductSellableRepository(
      sequelize,
      productSellableDiscountModelName
    );
  const inventoryRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryModelName
  );
  const inventoryWarehouseRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryWarehouseModelName
  );
  const warehouseRepository = new PostgresWarehouseRepository(
    sequelize,
    warehouseModelName
  );
  const warehouseUseCase = new WarehouseUseCase(warehouseRepository);
  const inventoryInvoiceRepository = new InventoryInvoiceRepository(
    sequelize,
    inventoryInvoiceModelName
  );
  const inventoryInvoiceUseCase = new InventoryInvoiceUseCase(
    inventoryInvoiceRepository
  );
  const inventoryUseCase = new InventoryUseCase(
    inventoryRepository,
    inventoryWarehouseRepository,
    inventoryInvoiceUseCase,
    warehouseUseCase
  );
  const productSellableVariantRepository =
    new PostgresProductSellableRepository(
      sequelize,
      productSellableVariantModelName
    );
  const discountRepository = new PostgresDiscountRepository(
    sequelize,
    discountModelName
  );
  const discountUseCase = new DiscountUseCase(discountRepository);
  const productSellableImageRepository = new PostgresProductSellableRepository(
    sequelize,
    productSellableImageModelName
  );
  const productSellableUseCase = new ProductSellableUseCase(
    productSellableRepository,
    cloudinaryRepository,
    productSellableDiscountRepository,
    inventoryUseCase,
    discountUseCase,
    productSellableVariantRepository,
    discountRepository,
    productSellableImageRepository
  );
  const brandRepository = new PostgresBrandRepository(
    sequelize,
    brandModelName
  );
  const variantUseCase = new VariantUseCase(
    variantRepository,
    variantOptionValueRepository,
    productSellableUseCase
  );
  const brandUseCase = new BrandUseCase(brandRepository);
  const useCase = new ProductUseCase(
    repository,
    productCategoryRepository,
    variantUseCase,
    productSellableUseCase,
    brandUseCase,
    sequelize
  );
  const httpService = new ProductHttpService(useCase);
  const router = Router();
  router.delete('/products/delete', httpService.bulkDelete.bind(httpService));
  router.get('/products', httpService.getProducts.bind(httpService));
  router.get('/products/:id', httpService.getProductById.bind(httpService));
  router.post('/products', httpService.createNewProduct.bind(httpService));
  router.put('/products/:id', httpService.updateProduct.bind(httpService));
  router.delete('/products/:id', httpService.deleteProduct.bind(httpService));
  return router;
};
