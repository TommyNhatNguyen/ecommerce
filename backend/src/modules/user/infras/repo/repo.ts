import { Includeable, Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { IUserRepository } from 'src/modules/user/models/user.interface';
import {
  IUserConditionDTO,
  IUserCreateDTO,
  IUserUpdateDTO,
} from 'src/modules/user/models/user.dto';
import { ListResponse, ModelStatus } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { User } from 'src/modules/user/models/user.model';
import {
  roleModelName,
  RolePersistence,
} from 'src/modules/role/infras/repo/dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import { permissionModelName, PermissionPersistence } from 'src/modules/permission/infras/repo/dto';

export class PostgresUserRepository implements IUserRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getUserByUsername(
    username: string,
    condition?: IUserConditionDTO
  ): Promise<User> {
    const include: Includeable[] = [];
    const roleInclude: Includeable[] = [];
    const { include_role, include_permission } = condition || {};
    if (include_role) {
      include.push({
        model: RolePersistence,
        as: roleModelName,
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES, "id"],
        },
        include: roleInclude,
      });
    }
    if (include_permission) {
      roleInclude.push({
        model: PermissionPersistence,
        as: permissionModelName,
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES, "id"],
        },
        through: {
          attributes: {
            exclude: [...EXCLUDE_ATTRIBUTES]
          }
        }
      });
    }
    const user = await this.sequelize.models[this.modelName].findOne({
      where: {
        username: {
          [Op.like]: username,
        },
      },
      include,
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
  async createUser(data: IUserCreateDTO): Promise<Omit<User, 'hash_password'>> {
    const newUser = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    const { hash_password, ...rest } = newUser.dataValues;
    return rest;
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
