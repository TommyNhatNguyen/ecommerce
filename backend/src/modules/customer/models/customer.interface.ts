import { Transaction } from "sequelize";
import {
  CustomerConditionDTO,
  CustomerCreateDTO,
  CustomerUpdateDTO,
  ICustomerLoginDTO,
} from "src/modules/customer/models/customer.dto";
import { Customer } from "src/modules/customer/models/customer.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export interface ICustomerUseCase {
  getCustomerById(
    id: string,
    condition: CustomerConditionDTO
  ): Promise<Omit<Customer, "hash_password">>;
  getCustomerList(
    paging: PagingDTO,
    condition: CustomerConditionDTO
  ): Promise<ListResponse<Omit<Customer, "hash_password">[]>>;
  createCustomer(
    data: Omit<CustomerCreateDTO, "cart_id" | "hash_password">,
    t?: Transaction
  ): Promise<Omit<Customer, "hash_password">>;
  updateCustomer(
    id: string,
    data: CustomerUpdateDTO
  ): Promise<Omit<Customer, "hash_password">>;
  deleteCustomer(id: string): Promise<boolean>;
  getCustomerByUsername(
    username: string,
    condition?: CustomerConditionDTO
  ): Promise<Customer>;
  loginCustomer(data: ICustomerLoginDTO): Promise<boolean | string>;
}

export interface ICustomerRepository
  extends IQueryRepository,
    ICommandRepository {
  getCustomerByUsername(
    username: string,
    condition?: CustomerConditionDTO
  ): Promise<Customer>;
}

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
  createCustomer(data: CustomerCreateDTO, t?: Transaction): Promise<Customer>;
  updateCustomer(id: string, data: CustomerUpdateDTO, t?: Transaction): Promise<Customer>;
  deleteCustomer(id: string, t?: Transaction): Promise<boolean>;
}
