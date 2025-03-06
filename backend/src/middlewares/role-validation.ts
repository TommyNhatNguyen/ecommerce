import { NextFunction, Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { CustomRequest, JWT_TYPES } from 'src/middlewares/jwt';
import { permissionRoleModelName } from 'src/modules/permission/infras/repo/dto';
import { roleModelName } from 'src/modules/role/infras/repo/dto';
import { PostgresRoleRepository } from 'src/modules/role/infras/repo/repo';
import { RoleUserCase } from 'src/modules/role/usecase';
import { PermissionType, ResourcesType } from 'src/share/models/base-model';

export const validateAuthorizationRole = (
  resource: ResourcesType,
  permission: PermissionType,
  sequelize: Sequelize
) => {
  const roleRepository = new PostgresRoleRepository(sequelize, roleModelName);
  const permissionRoleRepository = new PostgresRoleRepository(
    sequelize,
    permissionRoleModelName
  );
  const roleUseCase = new RoleUserCase(
    roleRepository,
    permissionRoleRepository
  );

  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { username, role_id } = req.data?.data;
      //   Find permission by role_id
      const roleInfo = await roleUseCase.getRoleById(role_id, {
        include_permissions: true,
      });
      const permissionsByResource = roleInfo.permission?.find(
        (item) => item.type === resource
      );
      if (!permissionsByResource) {
        res.status(403).json({
          message: 'Permission denied',
        });
        return;
      }
      console.log(
        permissionsByResource.permission_role?.[
          `allow_${permission.toLowerCase()}` as keyof typeof permissionsByResource.permission_role
        ]
      );
      if (
        !permissionsByResource.permission_role?.[
          `allow_${permission.toLowerCase()}` as keyof typeof permissionsByResource.permission_role
        ]
      ) {
        res.status(403).json({
          message: 'Permission denied',
        });
        return;
      }
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};
