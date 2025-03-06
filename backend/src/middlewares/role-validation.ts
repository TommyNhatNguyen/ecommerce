import { NextFunction, Request, Response } from 'express';
import { PermissionType, ResourcesType } from 'src/share/models/base-model';

export const validateAuthorizationRole = (
  resource: ResourcesType,
  permission: PermissionType
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
        
      // Get permission from role_id from database
      // Check
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};
