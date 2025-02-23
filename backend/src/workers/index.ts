import { CronJob } from 'cron';
import { Sequelize } from 'sequelize';
import { CloudinaryImageRepository } from 'src/infras/repository/image/repo';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { PostgresDiscountRepository } from 'src/modules/discount/infras/repo/postgres/discount.repo';
import { DiscountUseCase } from 'src/modules/discount/usecase';
import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { PostgresInventoryRepository } from 'src/modules/inventory/infras/repo/postgres/repo';
import { InventoryUseCase } from 'src/modules/inventory/usecase';
import {
  productSellableDiscountModelName,
  productSellableImageModelName,
  productSellableModelName,
  productSellableVariantModelName,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { PostgresProductSellableRepository } from 'src/modules/product_sellable/infras/repo/postgres/repo';
import { IProductSellableUseCase } from 'src/modules/product_sellable/models/product-sellable.interface';
import { ProductSellableUseCase } from 'src/modules/product_sellable/usecase';
import cloudinary from 'src/share/cloudinary';
import { timeLogger } from 'src/share/helpers/time-logger';
import { PRODUCT_SELLABLE_CRONJOB_ERROR } from 'src/workers/models/product-sellable.cronjob.error';
import { PRODUCT_SELLABLE_CRONJOB_MESSAGE } from 'src/workers/models/product-sellable.cronjob.message';

export const productSellableCronJobInit = (sequelize: Sequelize): CronJob => {
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
  const inventoryUseCase = new InventoryUseCase(inventoryRepository);
  const discountRepository = new PostgresDiscountRepository(
    sequelize,
    discountModelName
  );
  const productSellableVariantRepository =
    new PostgresProductSellableRepository(
      sequelize,
      productSellableVariantModelName
    );
  const imageRepository = new PostgresProductSellableRepository(
    sequelize,
    productSellableImageModelName
  );
  const discountUseCase = new DiscountUseCase(discountRepository);
  const productSellableUseCase = new ProductSellableUseCase(
    productSellableRepository,
    cloudinaryRepository,
    productSellableDiscountRepository,
    inventoryUseCase,
    discountUseCase,
    productSellableVariantRepository,
    discountRepository,
    imageRepository
  );
  const productSellableCronJob = new CronJob(
    '0 0 * * *', // cronTime
    async function () {
      try {
        await timeLogger(
          PRODUCT_SELLABLE_CRONJOB_MESSAGE.TIME_LOG,
          async () => {
            await productSellableUseCase.updateProductSellableDiscounts();
          }
        );
      } catch (error) {
        console.error(
          PRODUCT_SELLABLE_CRONJOB_ERROR.UPDATE_PRODUCT_SELLABLE_DISCOUNTS,
          error
        );
      }
    }, // onTick
    null, // onComplete
    false, // start
    'Asia/Ho_Chi_Minh' // timeZone
  );
  return productSellableCronJob;
};
