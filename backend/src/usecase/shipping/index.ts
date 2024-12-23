import { IShippingConditionDTO, IShippingCreateDTO, IShippingUpdateDTO } from "@models/shipping/shipping.dto";
import { IShippingRepository, IShippingUseCase } from "@models/shipping/shipping.interface";
import { Shipping } from "@models/shipping/shipping.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export class ShippingUseCase implements IShippingUseCase{
  constructor(private readonly shippingRepository: IShippingRepository){}
  getShippingById(id: string, condition: IShippingConditionDTO): Promise<Shipping | null> {
    return this.shippingRepository.getShippingById(id, condition);
  }
  getShippingList(paging: PagingDTO, condition: IShippingConditionDTO): Promise<ListResponse<Shipping[]>> {
    return this.shippingRepository.getShippingList(paging, condition);
  }
  createShipping(data: IShippingCreateDTO): Promise<Shipping> {
    return this.shippingRepository.createShipping(data);
  }
  updateShipping(id: string, data: IShippingUpdateDTO): Promise<Shipping> {
    console.log(id);
    console.log(data);
    return this.shippingRepository.updateShipping(id, data);
  }
  deleteShipping(id: string): Promise<boolean> {
    return this.shippingRepository.deleteShipping(id);
  }
}