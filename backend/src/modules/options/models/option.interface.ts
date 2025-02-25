import { Option, OptionValue } from './option.model';
import {
  OptionConditionDTO,
  OptionCreateDTO,
  OptionUpdateDTO,
  OptionValueConditionDTO,
  OptionValueCreateDTO,
  OptionValueUpdateDTO,
} from './option.dto';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IOptionUseCase {
  getOptionById(id: string, condition?: OptionConditionDTO): Promise<Option>;
  createOption(data: OptionCreateDTO): Promise<Option>;
  updateOption(id: string, data: OptionUpdateDTO): Promise<Option>;
  deleteOption(id: string): Promise<boolean>;
  listOption(
    paging: PagingDTO,
    condition?: OptionConditionDTO
  ): Promise<ListResponse<Option[]>>;
}

export interface IOptionRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  get(id: string, condition?: OptionConditionDTO): Promise<Option>;
  list(
    paging: PagingDTO,
    condition?: OptionConditionDTO
  ): Promise<ListResponse<Option[]>>;
}

export interface ICommandRepository {
  insert(data: Omit<OptionCreateDTO, 'option_values'>): Promise<Option>;
  update(
    id: string,
    data: Omit<OptionUpdateDTO, 'option_values'>
  ): Promise<Option>;
  delete(id: string): Promise<boolean>;
}

export interface IOptionValueUseCase {
  getOptionValueById(
    id: string,
    condition?: OptionValueConditionDTO
  ): Promise<OptionValue>;
  createOptionValue(data: OptionValueCreateDTO): Promise<OptionValue>;
  updateOptionValue(
    id: string,
    data: OptionValueUpdateDTO
  ): Promise<OptionValue>;
  deleteOptionValue(id: string): Promise<boolean>;
  listOptionValue(
    paging: PagingDTO,
    condition?: OptionValueConditionDTO
  ): Promise<ListResponse<OptionValue[]>>;
}

export interface IOptionValueRepository
  extends IQueryOptionValueRepository,
    ICommandOptionValueRepository {}

export interface IQueryOptionValueRepository {
  get(id: string, condition?: OptionValueConditionDTO): Promise<OptionValue>;
  list(
    paging: PagingDTO,
    condition?: OptionValueConditionDTO
  ): Promise<ListResponse<OptionValue[]>>;
}

export interface ICommandOptionValueRepository {
  insert(data: OptionValueCreateDTO): Promise<OptionValue>;
  update(id: string, data: OptionValueUpdateDTO): Promise<OptionValue>;
  delete(id: string): Promise<boolean>;
}
