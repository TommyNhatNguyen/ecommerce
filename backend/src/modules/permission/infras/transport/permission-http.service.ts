import { Request, Response } from 'express';
import {
  PermissionConditionDTOSchema,
  PermissionUpdateDTOSchema,
  PermissionCreateDTOSchema,
} from 'src/modules/permission/models/permission.dto';
import { IPermissionRepository } from 'src/modules/permission/models/permission.interface';
import { PagingDTOSchema } from 'src/share/models/paging';

export class PermissionHttpService {
  constructor(private readonly permissionRepository: IPermissionRepository) {}
  async getPermission(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const permission = await this.permissionRepository.getPermission(id);
      if (!permission) {
        res.status(404).json({ message: 'Permission not found' });
        return;
      }
      res.status(200).json({ ...permission, message: 'Permission found' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getPermissions(req: Request, res: Response) {
    console.log(req.query);
    const { success: pagingSuccess, data: pagingData } =
      PagingDTOSchema.safeParse(req.query);
    const { success: conditionSuccess, data: conditionData } =
      PermissionConditionDTOSchema.safeParse(req.query);
    if (!pagingSuccess || !conditionSuccess) {
      res.status(400).json({ message: 'Invalid paging or condition' });
      return;
    }
    try {
      const permissions = await this.permissionRepository.getPermissions(
        pagingData,
        conditionData
      );
      if (!permissions) {
        res.status(404).json({ message: 'Permissions not found' });
        return;
      }
      res.status(200).json({ ...permissions, message: 'Permissions found' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async createPermission(req: Request, res: Response) {
    const { success, data } = PermissionCreateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }
    try {
      const permission = await this.permissionRepository.createPermission(data);
      res
        .status(200)
        .json({ ...permission, message: 'Permission created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async updatePermission(req: Request, res: Response) {
    const { success, data } = PermissionUpdateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }
    const { id } = req.params;
    try {
      const permission = await this.permissionRepository.updatePermission(
        id,
        data
      );
      if (!permission) {
        res.status(404).json({ message: 'Permission not found' });
        return;
      }
      res
        .status(200)
        .json({ ...permission, message: 'Permission updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async deletePermission(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const permission = await this.permissionRepository.deletePermission(id);
      if (!permission) {
        res.status(404).json({ message: 'Permission not found' });
        return;
      }
      res.status(200).json({ message: 'Permission deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
