import {
  CustomerConditionDTO,
  CustomerCreateDTO,
  CustomerUpdateDTO,
} from 'src/modules/customer/models/customer.dto';
import { Customer } from 'src/modules/customer/models/customer.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface ICustomerUseCase {
  getCustomerById(
    id: string,
    condition: CustomerConditionDTO
  ): Promise<Customer>;
  getCustomerList(
    paging: PagingDTO,
    condition: CustomerConditionDTO
  ): Promise<ListResponse<Customer[]>>;
  createCustomer(
    data: Omit<CustomerCreateDTO, 'cart_id'>
  ): Promise<Customer>;
  updateCustomer(id: string, data: CustomerUpdateDTO): Promise<Customer>;
  deleteCustomer(id: string): Promise<boolean>;
}

export interface ICustomerRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  getCustomerById(
    id: string,
    condition?: CustomerConditionDTO
  ): Promise<Customer>;
  getCustomerList(
    paging: PagingDTO,
    condition: CustomerConditionDTO
  ): Promise<ListResponse<Customer[]>>;
}

export interface ICommandRepository {
  createCustomer(data: CustomerCreateDTO): Promise<Customer>;
  updateCustomer(id: string, data: CustomerUpdateDTO): Promise<Customer>;
  deleteCustomer(id: string): Promise<boolean>;
}
