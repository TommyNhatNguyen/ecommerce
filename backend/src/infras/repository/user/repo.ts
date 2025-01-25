import {
  IUserConditionDTO,
  IUserCreateDTO,
  IUserUpdateDTO,
} from "@models/user/user.dto";
import { IUserRepository } from "@models/user/user.interface";
import { User } from "@models/user/user.model";
import { Op } from "sequelize";
import { Sequelize } from "sequelize";
import { ListResponse, ModelStatus } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export class PostgresUserRepository implements IUserRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getUserByUsername(
    username: string,
    condition?: IUserConditionDTO
  ): Promise<User> {
    const user = await this.sequelize.models[this.modelName].findOne({
      where: {
        username: {
          [Op.like]: username,
        },
      },
    });
    return user?.dataValues;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.sequelize.models[this.modelName].findByPk(id);
    return user?.dataValues;
  }
  async getUsers(
    paging: PagingDTO,
    condition: IUserConditionDTO
  ): Promise<ListResponse<User[]>> {
    const { page, limit } = paging;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where: condition,
      limit,
      offset: (page - 1) * limit,
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        limit,
        total_count: count,
        current_page: page,
        total_page: Math.ceil(count / limit),
      },
    };
  }
  async createUser(data: IUserCreateDTO): Promise<User> {
    const newUser = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return newUser.dataValues;
  }
  async updateUser(id: string, data: IUserUpdateDTO): Promise<User> {
    const updatedUser = await this.sequelize.models[this.modelName].update(
      data,
      {
        where: { id },
        returning: true,
      }
    );
    return updatedUser[1][0].dataValues;
  }
  async deleteUser(id: string): Promise<boolean> {
    const deletedUser = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
