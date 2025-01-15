import { ICartRepository } from 'src/modules/cart/models/cart.interface';
import {
  CustomerCreateDTO,
  CustomerUpdateDTO,
} from 'src/modules/customer/models/customer.dto';
import { CustomerConditionDTO } from 'src/modules/customer/models/customer.dto';
import {
  ICustomerRepository,
  ICustomerUseCase,
} from 'src/modules/customer/models/customer.interface';
import { Customer } from 'src/modules/customer/models/customer.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class CustomerUseCase implements ICustomerUseCase {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly cartRepository: ICartRepository
  ) {}
  async getCustomerById(
    id: string,
    condition: CustomerConditionDTO
  ): Promise<Customer> {
    return await this.customerRepository.getCustomerById(id, condition);
  }
  async getCustomerList(
    paging: PagingDTO,
    condition: CustomerConditionDTO
  ): Promise<ListResponse<Customer[]>> {
    return await this.customerRepository.getCustomerList(paging, condition);
  }
  async createCustomer(data: CustomerCreateDTO): Promise<Customer> {
    const cart = await this.cartRepository.create({
      product_quantity: 0,
      product_count: 0,
      subtotal: 0,
      total_discount: 0,
      total: 0,
    });
    if (cart) {
      data.cart_id = cart.id;
    }
    console.log(data, cart);
    return await this.customerRepository.createCustomer(data);
  }
  async updateCustomer(id: string, data: CustomerUpdateDTO): Promise<Customer> {
    return await this.customerRepository.updateCustomer(id, data);
  }
  async deleteCustomer(id: string): Promise<boolean> {
    return await this.customerRepository.deleteCustomer(id);
  }
}
