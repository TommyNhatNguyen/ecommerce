import {
  IRoleConditionDTO,
  IRoleCreateDTO,
  IRoleUpdateDTO,
} from '@models/role/role.dto';
import { IRoleRepository } from '@models/role/role.interface';
import { Role } from '@models/role/role.model';
import { Sequelize } from 'sequelize';
import { PermissionPersistence } from 'src/infras/repository/permission/dto';
import { permissionModelName } from 'src/infras/repository/permission/dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresRoleRepository implements IRoleRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getRoleById(id: string): Promise<Role> {
    const role = await this.sequelize.models[this.modelName].findByPk(id, {
      include: {
        model: PermissionPersistence,
        as: permissionModelName,
        attributes: {
          exclude: EXCLUDE_ATTRIBUTES,
        },
        through: {
          attributes: [],
        },
      },
    });
    return role?.dataValues;
  }
  async getRoles(
    paging: PagingDTO,
    condition: IRoleConditionDTO
  ): Promise<ListResponse<Role[]>> {
    const { page, limit } = paging;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where: condition,
      limit,
      offset: (page - 1) * limit,
      include: {
        model: PermissionPersistence,
        as: permissionModelName,
        attributes: {
          exclude: EXCLUDE_ATTRIBUTES,
        },
        through: {
          attributes: [],
        },
      },
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
