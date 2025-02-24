import { Includeable, Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { IUserRepository } from 'src/modules/user/models/user.interface';
import {
  IUserConditionDTO,
  IUserCreateDTO,
  IUserUpdateDTO,
} from 'src/modules/user/models/user.dto';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
  ModelStatus,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { User } from 'src/modules/user/models/user.model';
import {
  roleModelName,
  RolePersistence,
} from 'src/modules/role/infras/repo/dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import {
  permissionModelName,
  PermissionPersistence,
} from 'src/modules/permission/infras/repo/dto';
import { ImagePersistence } from 'src/infras/repository/image/dto';
import { imageModelName } from 'src/infras/repository/image/dto';
import { Transaction } from 'sequelize';

export class PostgresUserRepository implements IUserRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getUserByUsername(
    username: string,
    condition?: IUserConditionDTO,
    t?: Transaction
  ): Promise<User> {
    const include: Includeable[] = [];
    const roleInclude: Includeable[] = [];
    const { include_role, include_permission, include_image } = condition || {};
    if (include_image) {
      include.push({
        model: ImagePersistence,
        as: imageModelName,
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES, 'cloudinary_id'],
        },
      });
    }
    if (include_role) {
      include.push({
        model: RolePersistence,
        as: roleModelName,
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES, 'id'],
        },
        include: roleInclude,
      });
    }
    if (include_permission) {
      roleInclude.push({
        model: PermissionPersistence,
        as: permissionModelName,
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES, 'id'],
        },
        through: {
          attributes: {
            exclude: [...EXCLUDE_ATTRIBUTES],
          },
        },
      });
    }

    if (t) {
      const user = await this.sequelize.models[this.modelName].findOne({
        where: {
          username: {
            [Op.like]: username,
          },
        },
        include,
        transaction: t,
      });
      return user?.dataValues;
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

  async getUserById(id: string, condition?: IUserConditionDTO): Promise<User> {
    const include: Includeable[] = [];
    const { include_image } = condition || {};
    if (include_image) {
      include.push({
        model: ImagePersistence,
        as: imageModelName,
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES, 'cloudinary_id'],
        },
      });
    }
    const user = await this.sequelize.models[this.modelName].findByPk(id, {
      attributes: {
        exclude: ['hash_password'],
      },
      include,
    });
    return user?.dataValues;
  }
  async getUsers(
    paging: PagingDTO,
    condition: IUserConditionDTO
  ): Promise<ListResponse<User[]>> {
    const { page, limit } = paging;
    const { order = BaseOrder.DESC, sortBy = BaseSortBy.CREATED_AT } =
      condition;
    const include: Includeable[] = [];
    if (condition.include_image) {
      include.push({
        model: ImagePersistence,
        as: imageModelName,
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES, 'cloudinary_id'],
        },
      });
    }
    if (condition.is_get_all) {
      const users = await this.sequelize.models[this.modelName].findAll({
        attributes: {
          exclude: ['hash_password'],
        },
        order: [[sortBy, order]],
        include,
      });
      return {
        data: users.map((user) => user.dataValues),
        meta: {
          limit: users.length,
          total_count: users.length,
          current_page: 1,
          total_page: 1,
        },
      };
    }
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where: condition,
      limit,
      offset: (page - 1) * limit,
      attributes: {
        exclude: ['hash_password'],
      },
      order: [[sortBy, order]],
      include,
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
      attributes: {
        exclude: ['hash_password'],
      },
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
    const { hash_password, ...rest } = updatedUser[1][0].dataValues;
    return rest;
  }
  async deleteUser(id: string): Promise<boolean> {
    const deletedUser = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return deletedUser > 0;
  }
}
