import { Includeable, Op, Sequelize } from 'sequelize';
import { PermissionPersistence } from 'src/modules/permission/infras/repo/dto';
import { permissionModelName } from 'src/modules/permission/infras/repo/dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { IRoleRepository } from 'src/modules/role/models/role.interface';
import { Role, RoleWithPermissions } from 'src/modules/role/models/role.model';
import {
  IRoleConditionDTO,
  IRoleCreateDTO,
  IRolePermissionCreateDTO,
  IRolePermissionUpdateDTO,
  IRoleUpdateDTO,
} from 'src/modules/role/models/role.dto';
import { WhereOptions } from '@sequelize/core';
import { UserPersistence } from 'src/modules/user/infras/repo/dto';
import { userModelName } from 'src/modules/user/infras/repo/dto';
import { ImagePersistence } from 'src/infras/repository/image/dto';
import { imageModelName } from 'src/infras/repository/image/dto';

export class PostgresRoleRepository implements IRoleRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async addPermissionToRole(
    data: IRolePermissionCreateDTO[]
  ): Promise<RoleWithPermissions[]> {
    console.log(data);
    const result = await this.sequelize.models[this.modelName].bulkCreate(
      data,
      {
        returning: true,
      }
    );
    return result.map((item) => item.dataValues);
  }

  async updatePermissionToRole(
    data: IRolePermissionUpdateDTO
  ): Promise<RoleWithPermissions> {
    const result = await this.sequelize.models[this.modelName].update(data, {
      where: {
        role_id: data.role_id,
        permission_id: data.permission_id,
      },
      returning: true,
    });
    return result[1][0].dataValues;
  }
  async getRoleById(id: string, condition: IRoleConditionDTO): Promise<Role> {
    const include: Includeable[] = [];
    const includeUser: Includeable[] = [];
    if (condition?.include_permissions) {
      include.push({
        model: PermissionPersistence,
        as: permissionModelName,
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES],
        },
        through: {
          attributes: {
            exclude: ['role_id', 'permission_id', ...EXCLUDE_ATTRIBUTES],
          },
        },
      });
    }
    if (condition?.include_users) {
      if (condition?.include_user_image) {
        includeUser.push({
          model: ImagePersistence,
          as: imageModelName,
          attributes: {
            exclude: [...EXCLUDE_ATTRIBUTES, 'cloudinary_id'],
          },
        });
      }
      include.push({
        model: UserPersistence,
        as: userModelName,
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES],
        },
        include: includeUser,
      });
    }
    const role = await this.sequelize.models[this.modelName].findByPk(id, {
      include,
    });
    return role?.dataValues;
  }

  async getRoleWithPermissions(id: string): Promise<RoleWithPermissions[]> {
    const role = await this.sequelize.models[this.modelName].findAll({
      where: {
        role_id: {
          [Op.eq]: id,
        },
      },
    });
    return role.map((item) => item.dataValues);
  }

  async getRoles(
    paging: PagingDTO,
    condition: IRoleConditionDTO
  ): Promise<ListResponse<Role[]>> {
    const where: WhereOptions = {};
    const include: Includeable[] = [];
    const includeUser: Includeable[] = [];
    where.name = {
      [Op.ne]: 'SUPER_ADMIN',
    };
    const { page, limit } = paging;
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;
    if (condition?.include_permissions) {
      include.push({
        model: PermissionPersistence,
        as: permissionModelName,
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES],
        },
        through: {
          attributes: {
            exclude: ['role_id', 'permission_id', ...EXCLUDE_ATTRIBUTES],
          },
        },
      });
    }
    if (condition?.include_users) {
      if (condition?.include_user_image) {
        includeUser.push({
          model: ImagePersistence,
          as: imageModelName,
          attributes: {
            exclude: [...EXCLUDE_ATTRIBUTES, 'cloudinary_id'],
          },
        });
      }
      include.push({
        model: UserPersistence,
        as: userModelName,
        attributes: ['username', 'email', 'phone', 'id'],
        include: includeUser,
      });
    }
    if (condition?.is_get_all) {
      const roles = await this.sequelize.models[this.modelName].findAll({
        where,
        include,
        order: [[sortBy, order]],
      });
      return {
        data: roles.map((role) => role.dataValues),
        meta: {
          limit: roles.length,
          total_count: roles.length,
          total_page: 1,
          current_page: 1,
        },
      };
    }
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      include,
      order: [[sortBy, order]],
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        limit,
        total_count: count,
        total_page: Math.ceil(count / limit),
        current_page: page,
      },
    };
  }
  async createRole(data: IRoleCreateDTO): Promise<Role> {
    const role = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return role.dataValues;
  }
  async updateRole(id: string, data: IRoleUpdateDTO): Promise<Role> {
    const role = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return role[1][0].dataValues;
  }
  async deleteRole(id: string): Promise<boolean> {
    const role = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
