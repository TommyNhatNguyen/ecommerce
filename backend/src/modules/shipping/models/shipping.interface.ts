
import { IShippingCreateDTO } from "src/modules/shipping/models/shipping.dto";
import { IShippingUpdateDTO } from "src/modules/shipping/models/shipping.dto";
import { IShippingConditionDTO } from "src/modules/shipping/models/shipping.dto";
import { Shipping } from "src/modules/shipping/models/shipping.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export interface IShippingUseCase{
  getShippingById(id: string, condition?: IShippingConditionDTO): Promise<Shipping | null>;
  getShippingList(paging: PagingDTO, condition?: IShippingConditionDTO): Promise<ListResponse<Shipping[]>>;
  createShipping(data: IShippingCreateDTO): Promise<Shipping>;
  updateShipping(id: string, data: IShippingUpdateDTO): Promise<Shipping>;
  deleteShipping(id: string): Promise<boolean>;
}

export interface IShippingRepository extends ICommandRepository, IQueryRepository{}

export interface IQueryRepository{
  getShippingById(id: string, condition: IShippingConditionDTO): Promise<Shipping | null>;
  getShippingList(paging: PagingDTO, condition: IShippingConditionDTO): Promise<ListResponse<Shipping[]>>;
}

export interface ICommandRepository {
  createShipping(data: IShippingCreateDTO): Promise<Shipping>;
  updateShipping(id: string, data: IShippingUpdateDTO): Promise<Shipping>;
  deleteShipping(id: string): Promise<boolean>;
}
