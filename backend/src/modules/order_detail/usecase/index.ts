import { IOrderDetailRepository } from "src/modules/order_detail/models/order_detail.interface";
import { OrderDetailConditionDTO, OrderDetailCreateDTO, OrderDetailUpdateDTO } from "src/modules/order_detail/models/order_detail.dto";
import { IOrderDetailUseCase } from "src/modules/order_detail/models/order_detail.interface";
import { OrderDetail } from "src/modules/order_detail/models/order_detail.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export class OrderDetailUseCase implements IOrderDetailUseCase {
  constructor(private readonly orderDetailRepository: IOrderDetailRepository) {}
  async getById(
    id: string,
    condition: OrderDetailConditionDTO
  ): Promise<OrderDetail> {
    return await this.orderDetailRepository.getById(id, condition);
  }
  async getList(
    paging: PagingDTO,
    condition: OrderDetailConditionDTO
  ): Promise<ListResponse<OrderDetail[]>> {
    return await this.orderDetailRepository.getList(paging, condition);
  }
  async create(data: OrderDetailCreateDTO): Promise<OrderDetail> {
    return await this.orderDetailRepository.create(data);
  }
  async update(id: string, data: OrderDetailUpdateDTO): Promise<OrderDetail> {
    return await this.orderDetailRepository.update(id, data);
  }
  async delete(id: string): Promise<boolean> {
    return await this.orderDetailRepository.delete(id);
  }
}
