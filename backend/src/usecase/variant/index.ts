import {
  VariantCreateDTO,
  VariantUpdateDTO,
  VariantConditionDTO,
} from '@models/variant/variant.dto';
import {
  IVariantRepository,
  IVariantUseCase,
} from '@models/variant/variant.interface';
import { Variant } from '@models/variant/variant.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class VariantUseCase implements IVariantUseCase {
  constructor(private readonly variantRepository: IVariantRepository) {}
  getVariantById(
    id: string,
    condition?: VariantConditionDTO
  ): Promise<Variant> {
    return this.variantRepository.get(id, condition);
  }
  createVariant(data: VariantCreateDTO): Promise<Variant> {
    return this.variantRepository.insert(data);
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
