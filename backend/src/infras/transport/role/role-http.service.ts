import { IRoleConditionSchema, IRoleCreateDTOSchema, IRoleUpdateDTOSchema } from '@models/role/role.dto';
import { IRoleUseCase } from '@models/role/role.interface';
import { Request, Response } from 'express';
import { PagingDTOSchema } from 'src/share/models/paging';

export class RoleHttpService {
  constructor(private readonly roleUseCase: IRoleUseCase) {}
  async getRoles(req: Request, res: Response) {
    const { success: pagingSuccess, data: pagingData } =
      PagingDTOSchema.safeParse(req.query);
    const { success: conditionSuccess, data: conditionData } =
      IRoleConditionSchema.safeParse(req.query);
    if (!pagingSuccess || !conditionSuccess) {
      res.status(400).json({ message: 'Invalid paging or condition data' });
      return;
    }
    try {
      const roles = await this.roleUseCase.getRoles(pagingData, conditionData);
      if (roles.data.length === 0) {
        res.status(404).json({ message: 'No roles found' });
        return;
      }
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getRoleById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const role = await this.roleUseCase.getRoleById(id);
      if (!role) {
        res.status(404).json({ message: 'Role not found' });
        return;
      }
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async createRole(req: Request, res: Response) {
    const { success: dataSuccess, data: dataData } =
      IRoleCreateDTOSchema.safeParse(req.body);
    if (!dataSuccess) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }
    try {
      const role = await this.roleUseCase.createRole(dataData);
      if (!role) {
        res.status(400).json({ message: 'Failed to create role' });
        return;
      }
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async updateRole(req: Request, res: Response) {
    const { id } = req.params;
    const { success: dataSuccess, data: dataData } =
      IRoleUpdateDTOSchema.safeParse(req.body);
    if (!dataSuccess) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }
    try {
      const role = await this.roleUseCase.updateRole(id, dataData);
      if (!role) {
        res.status(400).json({ message: 'Failed to update role' });
        return;
      }
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async deleteRole(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const role = await this.roleUseCase.deleteRole(id);
      if (!role) {
        res.status(400).json({ message: 'Failed to delete role' });
        return;
      }
      res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
