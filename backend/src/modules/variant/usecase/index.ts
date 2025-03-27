import { Transaction } from 'sequelize';
import { IInventoryUseCase } from 'src/modules/inventory/models/inventory.interface';
import { IProductSellableUseCase } from 'src/modules/product_sellable/models/product-sellable.interface';
import {
  VariantCreateDTO,
  VariantUpdateDTO,
  VariantConditionDTO,
  VariantOptionValueCreateDTO,
  VariantBulkDeleteDTO,
} from 'src/modules/variant/models/variant.dto';
import {
  IVariantRepository,
  IVariantUseCase,
} from 'src/modules/variant/models/variant.interface';
import { Variant } from 'src/modules/variant/models/variant.model';
import { IWarehouseUsecase } from 'src/modules/warehouse/models/warehouse.interface';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class VariantUseCase implements IVariantUseCase {
  constructor(
    private readonly variantRepository: IVariantRepository,
    private readonly variantOptionValueRepository: IVariantRepository,
    private readonly productSellableUseCase: IProductSellableUseCase,
    private readonly inventoryUseCase?: IInventoryUseCase,
    private readonly warehouseUseCase?: IWarehouseUsecase
  ) {}

  async getAll(
    data?: VariantConditionDTO,
    t?: Transaction
  ): Promise<Variant[]> {
    return await this.variantRepository.getAll(data, t);
  }

  async bulkDelete(
    data: VariantBulkDeleteDTO,
    t?: Transaction
  ): Promise<boolean> {
    const { ids } = data;
    const variants = await this.variantRepository.getAll(
      {
        ids,
        include_inventory: true,
        include_warehouse: true,
        include_product_sellable: true,
      },
      t
    );

    for (const variant of variants) {
      const inventoryId = variant.product_sellable?.inventory?.id || '';
      const warehouses = variant.product_sellable?.inventory?.warehouse || [];

      for (const variantWarehouse of warehouses) {
        const warehouseId = variantWarehouse.id;
        const inventoryWarehouse =
          await this.inventoryUseCase?.getInventoryByInventoryIdAndWarehouseId(
            inventoryId,
            warehouseId,
            t
          );

        const warehouse = await this.warehouseUseCase?.getWarehouseById(
          warehouseId,
          {},
          t
        );

        await this.warehouseUseCase?.updateWarehouse(
          warehouseId,
          {
            total_quantity:
              (warehouse?.total_quantity || 0) -
              (inventoryWarehouse?.quantity || 0),
            total_cost:
              (warehouse?.total_cost || 0) -
              (inventoryWarehouse?.total_cost || 0),
          },
          t
        );

        await this.inventoryUseCase?.deleteInventoryWarehouse(
          inventoryId,
          warehouseId,
          t
        );
      }
    }

    return this.variantRepository.bulkDelete(data, t);
  }

  addOptionValue(data: VariantOptionValueCreateDTO[]): Promise<boolean> {
    return this.variantOptionValueRepository.addOptionValue(data);
  }
  getVariantById(
    id: string,
    condition?: VariantConditionDTO
  ): Promise<Variant> {
    return this.variantRepository.get(id, condition);
  }
  async createVariant(
    data: VariantCreateDTO,
    t?: Transaction
  ): Promise<Variant> {
    const variant = await this.variantRepository.insert(data, t);
    await this.variantOptionValueRepository.addOptionValue(
      data.options_value_ids.map((optionValueId) => ({
        variant_id: variant.id,
        option_value_id: optionValueId,
      })),
      t
    );
    if (this.productSellableUseCase) {
      const productSellable =
        await this.productSellableUseCase.createNewProductSellable(
          {
            ...data.product_sellables,
            variant_id: variant.id,
          },
          t
        );
      console.log(
        '🚀 ~ VariantUseCase ~ productSellable:',
        productSellable,
        variant.id,
        data
      );
    }
    return variant;
  }
  updateVariant(id: string, data: VariantUpdateDTO): Promise<Variant> {
    return this.variantRepository.update(id, data);
  }
  deleteVariant(id: string): Promise<boolean> {
    return this.variantRepository.delete(id);
  }
  listVariant(
    paging: PagingDTO,
    condition?: VariantConditionDTO
  ): Promise<ListResponse<Variant[]>> {
    return this.variantRepository.list(paging, condition);
  }
}
