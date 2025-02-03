import {
  IOptionRepository,
  IOptionValueRepository,
  IOptionValueUseCase,
} from 'src/modules/options/models/option.interface';
import {
  OptionCreateDTO,
  OptionUpdateDTO,
  OptionConditionDTO,
  OptionValueConditionDTO,
  OptionValueCreateDTO,
  OptionValueUpdateDTO,
} from 'src/modules/options/models/option.dto';
import { IOptionUseCase } from 'src/modules/options/models/option.interface';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { Option, OptionValue } from 'src/modules/options/models/option.model';

export class OptionUseCase implements IOptionUseCase {
  constructor(private readonly optionRepository: IOptionRepository) {}
  getOptionById(id: string, condition?: OptionConditionDTO): Promise<Option> {
    return this.optionRepository.get(id, condition);
  }
  createOption(data: OptionCreateDTO): Promise<Option> {
    return this.optionRepository.insert(data);
  }
  updateOption(id: string, data: OptionUpdateDTO): Promise<Option> {
    return this.optionRepository.update(id, data);
  }
  deleteOption(id: string): Promise<boolean> {
    return this.optionRepository.delete(id);
  }
  listOption(
    paging: PagingDTO,
    condition?: OptionConditionDTO
  ): Promise<ListResponse<Option[]>> {
    return this.optionRepository.list(paging, condition);
  }
}

export class OptionValueUseCase implements IOptionValueUseCase {
  constructor(private readonly optionValueRepository: IOptionValueRepository) {}
  getOptionValueById(
    id: string,
    condition?: OptionValueConditionDTO
  ): Promise<OptionValue> {
    return this.optionValueRepository.get(id, condition);
  }
  createOptionValue(data: OptionValueCreateDTO): Promise<OptionValue> {
    return this.optionValueRepository.insert(data);
  }
  updateOptionValue(
    id: string,
    data: OptionValueUpdateDTO
  ): Promise<OptionValue> {
    return this.optionValueRepository.update(id, data);
  }
  deleteOptionValue(id: string): Promise<boolean> {
    return this.optionValueRepository.delete(id);
  }
  listOptionValue(
    paging: PagingDTO,
    condition?: OptionValueConditionDTO
  ): Promise<ListResponse<OptionValue[]>> {
    return this.optionValueRepository.list(paging, condition);
  }
}
