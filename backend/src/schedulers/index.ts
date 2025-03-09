import { CronJob } from 'cron';
import { Sequelize } from 'sequelize';
import { CloudinaryImageRepository } from 'src/modules/image/infras/repo/repo';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { PostgresDiscountRepository } from 'src/modules/discount/infras/repo/postgres/discount.repo';
import { DiscountUseCase } from 'src/modules/discount/usecase';
import { inventoryModelName, inventoryWarehouseModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
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
import {
  INVENTORY_CRONJOB_ERROR,
  PRODUCT_SELLABLE_CRONJOB_ERROR,
} from 'src/schedulers/models/product-sellable.cronjob.error';
import { PRODUCT_SELLABLE_CRONJOB_MESSAGE } from 'src/schedulers/models/product-sellable.cronjob.message';
import { MessageUsecase } from 'src/modules/messages/usecase';
import { PostgresMessageRepository } from 'src/modules/messages/infras/repo/postgres/repo';
import { messageModelName } from 'src/modules/messages/infras/repo/postgres/dto';
import { actorModelName } from 'src/modules/messages/actor/infras/postgres/dto';
import { PostgresEntityRepository } from 'src/modules/messages/entity/infras/postgres/repo';
import { PostgresCustomerRepository } from 'src/modules/customer/infras/repo/postgres/customer.repo';
import { entityModelName } from 'src/modules/messages/entity/infras/postgres/dto';
import { customerModelName } from 'src/modules/customer/infras/repo/postgres/customer.dto';
import { PostgresActorRepository } from 'src/modules/messages/actor/infras/postgres/repo';
import { CustomerUseCase } from 'src/modules/customer/usecase';
import { SocketIoAdapter } from 'src/socket/infras/transport';
import { SocketUseCase } from 'src/socket/usecase';
import { SOCKET_NAMESPACE } from 'src/socket/models/socket-endpoint';
import { ActorType } from 'src/modules/messages/actor/models/actor.model';
import { EntityKind } from 'src/modules/messages/entity/models/entity.model';
import { StockStatus } from 'src/modules/inventory/models/inventory.model';
import Publisher from 'src/brokers/infras/publisher';
import { QueueTypes } from 'src/brokers/transport/queueTypes';

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
  const inventoryWarehouseRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryWarehouseModelName
  );
  const inventoryUseCase = new InventoryUseCase(inventoryRepository, inventoryWarehouseRepository);
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
    '5 0 * * *', // cronTime
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

export const inventoryLowStockCronJobInit = (
  sequelize: Sequelize,
  inventoryAlertPublisher: Publisher
): CronJob => {
  const messageRepository = new PostgresMessageRepository(
    sequelize,
    messageModelName
  );
  const actorRepository = new PostgresActorRepository(
    sequelize,
    actorModelName
  );
  const entityRepository = new PostgresEntityRepository(
    sequelize,
    entityModelName
  );
  const customerRepository = new PostgresCustomerRepository(
    sequelize,
    customerModelName
  );
  const customerUseCase = new CustomerUseCase(customerRepository);
  const messageUseCase = new MessageUsecase(
    messageRepository,
    actorRepository,
    entityRepository,
    customerUseCase
  );
  const inventoryRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryModelName
  );
  const inventoryWarehouseRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryWarehouseModelName
  );
  const inventoryUseCase = new InventoryUseCase(inventoryRepository, inventoryWarehouseRepository);

  const inventoryLowStockCronJob = new CronJob(
    '0 9 * * *', // cronTime
    async function () {
      try {
        await timeLogger(
          INVENTORY_CRONJOB_ERROR.GET_INVENTORY_LIST,
          async () => {
            const inventories = await inventoryUseCase.getInventoryList(
              {
                page: 1,
                limit: 1000,
              },
              {
                include_all: true,
                include_product_sellable: true,
              }
            );
            console.log('🚀 ~ inventories:', inventories);
            for (const inventory of inventories.data) {
              if (inventory.stock_status !== StockStatus.IN_STOCK) {
                const message = await messageUseCase.createMessage({
                  entity_info: {
                    type: 'inventory',
                    kind: EntityKind.NOTIFICATION,
                  },
                  actor_info_id: '01953dd6-65f9-73d8-8497-048605665a83',
                  actor_type: ActorType.SYSTEM,
                  message: `Updated at ${new Date().toLocaleString()}: ${
                    inventory.product_sellable.variant.name
                  } is running out of stock: ${inventory.total_quantity} left`,
                });
                console.log('🚀 ~ message:', message);
                inventoryAlertPublisher.publishMessage(
                  QueueTypes.INVENTORY_ALERT,
                  {
                    from: 'inventory',
                    message: inventory,
                  }
                );
              }
            }
          }
        );
      } catch (error) {
        console.log('🚀 ~ error:', error);
        console.error(INVENTORY_CRONJOB_ERROR.GET_INVENTORY_LIST, error);
      }
    }
  );
  return inventoryLowStockCronJob;
};
