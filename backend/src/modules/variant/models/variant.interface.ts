import { Variant } from 'src/modules/variant/models/variant.model';
import { VariantConditionDTO, VariantCreateDTO, VariantOptionValueCreateDTO, VariantUpdateDTO } from './variant.dto';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IVariantUseCase {
  getVariantById(id: string, condition?: VariantConditionDTO): Promise<Variant>;
  createVariant(data: VariantCreateDTO): Promise<Variant>;
  updateVariant(id: string, data: VariantUpdateDTO): Promise<Variant>;
  deleteVariant(id: string): Promise<boolean>;
  listVariant(
    paging: PagingDTO,
    condition?: VariantConditionDTO
  ): Promise<ListResponse<Variant[]>>;
  addOptionValue(data: VariantOptionValueCreateDTO[]): Promise<boolean>;
}

export interface IVariantRepository
  extends IQueryRepository,
    ICommandRepository {
      addOptionValue(data: VariantOptionValueCreateDTO[]): Promise<boolean>;
    }

export interface IQueryRepository {
  get(id: string, condition?: VariantConditionDTO): Promise<Variant>;
  list(
    paging: PagingDTO,
    condition?: VariantConditionDTO
  ): Promise<ListResponse<Variant[]>>;
}

export interface ICommandRepository {
  insert(data: Omit<VariantCreateDTO, 'options_value_ids'>): Promise<Variant>;
  update(id: string, data: VariantUpdateDTO): Promise<Variant>;
  delete(id: string): Promise<boolean>;
}
