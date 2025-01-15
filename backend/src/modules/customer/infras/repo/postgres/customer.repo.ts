import { Sequelize } from 'sequelize';
import { Customer } from 'src/modules/customer/models/customer.model';
import { CustomerConditionDTO, CustomerCreateDTO, CustomerUpdateDTO } from 'src/modules/customer/models/customer.dto';
import { ICustomerRepository } from 'src/modules/customer/models/customer.interface';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresCustomerRepository implements ICustomerRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getCustomerById(
    id: string,
    condition: CustomerConditionDTO
  ): Promise<Customer> {
    const customer = await this.sequelize.models[this.modelName].findByPk(id);
    return customer?.dataValues;
  }
  async getCustomerList(
    paging: PagingDTO,
    condition: CustomerConditionDTO
  ): Promise<ListResponse<Customer[]>> {
    const { page, limit } = paging;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      distinct: true,
      where: condition,
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        current_page: page,
        limit,
        total_count: count,
        total_page: Math.ceil(count / limit),
      },
    };
  }
  async createCustomer(data: CustomerCreateDTO): Promise<Customer> {
    console.log(data)
    const customer = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return customer.dataValues;
  }
  async updateCustomer(id: string, data: CustomerUpdateDTO): Promise<Customer> {
    const customer = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return customer[1][0].dataValues;
  }
  async deleteCustomer(id: string): Promise<boolean> {
    const customer = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
