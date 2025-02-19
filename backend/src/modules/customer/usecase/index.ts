import { compare, hash } from "bcrypt";
import { Transaction } from "sequelize";
import { ICartRepository } from "src/modules/cart/models/cart.interface";
import {
  CustomerCreateDTO,
  CustomerUpdateDTO,
  ICustomerLoginDTO,
} from "src/modules/customer/models/customer.dto";
import { CustomerConditionDTO } from "src/modules/customer/models/customer.dto";
import {
  ICustomerRepository,
  ICustomerUseCase,
} from "src/modules/customer/models/customer.interface";
import { Customer } from "src/modules/customer/models/customer.model";
import {
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD,
} from "src/modules/user/models/user.error";
import { ListResponse, ModelStatus } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export class CustomerUseCase implements ICustomerUseCase {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly cartRepository?: ICartRepository
  ) {}
  async getCustomerByUsername(
    username: string,
    condition?: CustomerConditionDTO
  ) {
    return await this.customerRepository.getCustomerByUsername(
      username,
      condition
    );
  }
  async loginCustomer(data: ICustomerLoginDTO): Promise<string | boolean> {
    const { username, password } = data;
    console.log("🚀 ~ CustomerUseCase ~ loginCustomer ~ data:", data);
    // Check if user exist
    const user = await this.getCustomerByUsername(username);
    if (!user) throw USER_NOT_FOUND_ERROR;
    // Check if password is correct
    console.log("🚀 ~ CustomerUseCase ~ loginCustomer ~ user:", user);
    const isCorrectPassword = await compare(password, user.hash_password);
    console.log(
      "🚀 ~ CustomerUseCase ~ loginCustomer ~ user:",
      isCorrectPassword
    );
    if (!isCorrectPassword) throw WRONG_PASSWORD;
    return user?.username;
  }
  async getCustomerById(
    id: string,
    condition: CustomerConditionDTO
  ): Promise<Omit<Customer, "hash_password">> {
    const { hash_password, ...rest } =
      await this.customerRepository.getCustomerById(id, condition);
    return rest;
  }
  async getCustomerList(
    paging: PagingDTO,
    condition: CustomerConditionDTO
  ): Promise<ListResponse<Omit<Customer, "hash_password">[]>> {
    return await this.customerRepository.getCustomerList(paging, condition);
  }
  async createCustomer(
    data: CustomerCreateDTO,
    t?: Transaction
  ): Promise<Omit<Customer, "hash_password">> {
    const cart = await this.cartRepository?.create({
      product_quantity: 0,
      product_count: 0,
      subtotal: 0,
      total_discount: 0,
      total: 0,
    }, t);
    if (data.password) {
      const hash_password_input = await hash(
        data.password,
        Number(process.env.BCRYPT_SALT)
      );
      data.hash_password = hash_password_input;
    }
    if (cart) {
      data.cart_id = cart.id;
    }
    const { hash_password, ...rest } =
      await this.customerRepository.createCustomer(data, t);
    return rest;
  }
  async updateCustomer(
    id: string,
    data: CustomerUpdateDTO,
    t?: Transaction
  ): Promise<Omit<Customer, "hash_password">> {
    const { hash_password, ...rest } =
      await this.customerRepository.updateCustomer(id, data, t);
    return rest;
  }
  async deleteCustomer(id: string): Promise<boolean> {
    return await this.customerRepository.deleteCustomer(id);
  }
}
