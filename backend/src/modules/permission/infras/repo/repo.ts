import { Includeable, Sequelize, where } from 'sequelize';
import { Permission } from 'src/modules/permission/models/permission.model';
import {
  PermissionConditionDTO,
  PermissionUpdateDTO,
  PermissionCreateDTO,
} from 'src/modules/permission/models/permission.dto';
import { IPermissionRepository } from 'src/modules/permission/models/permission.interface';
import {
  roleModelName,
  RolePersistence,
} from 'src/modules/role/infras/repo/dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { WhereOptions } from '@sequelize/core';

export class PermissionRepository implements IPermissionRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getPermission(
    id: string,
    condition: PermissionConditionDTO
  ): Promise<Permission | null> {
    const where: WhereOptions = {};
    const include: Includeable[] = [];
    if (condition.include_role) {
      include.push({
        model: RolePersistence,
        as: roleModelName,
        attributes: {
          exclude: EXCLUDE_ATTRIBUTES,
        },
        through: {
          attributes: [],
        },
      });
    }
    const permission = await this.sequelize.models[this.modelName].findByPk(
      id,
      {
        include,
      }
    );
    return permission?.dataValues ?? null;
  }
  async getPermissions(
    paging: PagingDTO,
    condition: PermissionConditionDTO
  ): Promise<ListResponse<Permission[]>> {
    const include: Includeable[] = [];
    if (condition.include_role) {
      include.push({
        model: RolePersistence,
        as: roleModelName,
        attributes: {
          exclude: EXCLUDE_ATTRIBUTES,
        },
        through: {
          attributes: [],
        },
      });
    }
    const { page, limit } = paging;
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;
    const { count, rows } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      order: [[sortBy, order]],
      limit,
      offset: (page - 1) * limit,
      include,
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
  async createPermission(data: PermissionCreateDTO): Promise<Permission> {
    const permission = await this.sequelize.models[this.modelName].create(
      data,
      {
        returning: true,
        include: {
          model: RolePersistence,
          as: roleModelName,
          attributes: {
            exclude: EXCLUDE_ATTRIBUTES,
          },
          through: {
            attributes: [],
          },
        },
      }
    );
    return permission.dataValues;
  }
  async updatePermission(
    id: string,
    data: PermissionUpdateDTO
  ): Promise<Permission> {
    const permission = await this.sequelize.models[this.modelName].update(
      data,
      { where: { id }, returning: true }
    );
    return permission[1][0].dataValues;
  }
  async deletePermission(id: string): Promise<boolean> {
    const permission = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
