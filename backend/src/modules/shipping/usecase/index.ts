import {
  IShippingCreateDTO,
  IShippingUpdateDTO,
} from 'src/modules/shipping/models/shipping.dto';
import { IShippingConditionDTO } from 'src/modules/shipping/models/shipping.dto';
import { IShippingUseCase } from 'src/modules/shipping/models/shipping.interface';
import { IShippingRepository } from 'src/modules/shipping/models/shipping.interface';
import { Shipping } from 'src/modules/shipping/models/shipping.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class ShippingUseCase implements IShippingUseCase {
  constructor(private readonly shippingRepository: IShippingRepository) {}
  getShippingById(
    id: string,
    condition: IShippingConditionDTO
  ): Promise<Shipping | null> {
    return this.shippingRepository.getShippingById(id, condition);
  }
  getShippingList(
    paging: PagingDTO,
    condition: IShippingConditionDTO
  ): Promise<ListResponse<Shipping[]>> {
    return this.shippingRepository.getShippingList(paging, condition);
  }
  createShipping(data: IShippingCreateDTO): Promise<Shipping> {
    return this.shippingRepository.createShipping(data);
  }
  updateShipping(id: string, data: IShippingUpdateDTO): Promise<Shipping> {
    return this.shippingRepository.updateShipping(id, data);
  }
  deleteShipping(id: string): Promise<boolean> {
    return this.shippingRepository.deleteShipping(id);
  }
}
