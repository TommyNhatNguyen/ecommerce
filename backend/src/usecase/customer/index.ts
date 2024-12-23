import { CustomerConditionDTO, CustomerCreateDTO, CustomerUpdateDTO } from "@models/customer/customer.dto";
import { ICustomerRepository, ICustomerUseCase } from "@models/customer/customer.interface";
import { Customer } from "@models/customer/customer.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export class CustomerUseCase implements ICustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}
  async getCustomerById(id: string, condition: CustomerConditionDTO): Promise<Customer> {
    return await this.customerRepository.getCustomerById(id, condition)
  }
  async getCustomerList(paging: PagingDTO, condition: CustomerConditionDTO): Promise<ListResponse<Customer[]>> {
    return await this.customerRepository.getCustomerList(paging, condition)
  }
  async createCustomer(data: CustomerCreateDTO): Promise<Customer> {
    return await this.customerRepository.createCustomer(data)
  }
  async updateCustomer(id: string, data: CustomerUpdateDTO): Promise<Customer> {
    return await this.customerRepository.updateCustomer(id, data)
  }
  async deleteCustomer(id: string): Promise<boolean> {
    return await this.customerRepository.deleteCustomer(id)
  }

}