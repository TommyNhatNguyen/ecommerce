import { Transaction } from 'sequelize';
import { IProductSellableUseCase } from 'src/modules/product_sellable/models/product-sellable.interface';
import {
  VariantCreateDTO,
  VariantUpdateDTO,
  VariantConditionDTO,
  VariantOptionValueCreateDTO,
} from 'src/modules/variant/models/variant.dto';
import {
  IVariantRepository,
  IVariantUseCase,
} from 'src/modules/variant/models/variant.interface';
import { Variant } from 'src/modules/variant/models/variant.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class VariantUseCase implements IVariantUseCase {
  constructor(
    private readonly variantRepository: IVariantRepository,
    private readonly variantOptionValueRepository: IVariantRepository,
    private readonly productSellableUseCase: IProductSellableUseCase
  ) {}
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
      console.log("🚀 ~ VariantUseCase ~ productSellable:", productSellable, variant.id, data)
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
