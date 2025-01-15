import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { ICartUseCase } from 'src/modules/cart/models/cart.interface';
import { ICartRepository } from 'src/modules/cart/models/cart.interface';
import {
  CartConditionDTO,
  CartCreateDTO,
  CartUpdateDTO,
} from 'src/modules/cart/models/cart.dto';
import { Cart } from 'src/modules/cart/models/cart.model';

export class CartUseCase implements ICartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}
  async getById(id: string, condition: CartConditionDTO): Promise<Cart> {
    return await this.cartRepository.getById(id, condition);
  }
  async getList(
    paging: PagingDTO,
    condition: CartConditionDTO
  ): Promise<ListResponse<Cart[]>> {
    return await this.cartRepository.getList(paging, condition);
  }
  async create(data: CartCreateDTO): Promise<Cart> {
    return await this.cartRepository.create(data);
  }
  async update(id: string, data: CartUpdateDTO): Promise<Cart> {
    return await this.cartRepository.update(id, data);
  }
  async delete(id: string): Promise<boolean> {
    return await this.cartRepository.delete(id);
  }
}
