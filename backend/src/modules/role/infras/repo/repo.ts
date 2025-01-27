import { Op, Sequelize } from 'sequelize';
import { PermissionPersistence } from 'src/modules/permission/infras/repo/dto';
import { permissionModelName } from 'src/modules/permission/infras/repo/dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import { ListResponse } from 'src/share/models/base-model';
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
  async getRoleById(id: string): Promise<Role> {
    const role = await this.sequelize.models[this.modelName].findByPk(id, {
      include: {
        model: PermissionPersistence,
        as: permissionModelName,
        attributes: {
          exclude: EXCLUDE_ATTRIBUTES,
        },
        through: {
          attributes: {
            exclude: ['role_id', 'permission_id', ...EXCLUDE_ATTRIBUTES],
          },
        },
      },
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
          attributes: {
            exclude: ['role_id', 'permission_id', ...EXCLUDE_ATTRIBUTES],
          },
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
