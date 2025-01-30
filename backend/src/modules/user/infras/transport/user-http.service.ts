import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from 'src/middlewares/jwt';
import { PagingDTOSchema } from 'src/share/models/paging';
import { IUserUseCase } from 'src/modules/user/models/user.interface';
import {
  IUserConditionSchema,
  IUserCreateDTOSchema,
  IUserLoginDTOSchema,
  IUserUpdateDTOSchema,
} from 'src/modules/user/models/user.dto';

export class UserHttpService {
  constructor(private readonly userUseCase: IUserUseCase) {}

  async getUserByUsername(req: CustomRequest, res: Response) {
    const username = req.data?.data;
    const { data: conditionData, success: conditionSuccess } =
      IUserConditionSchema.safeParse(req.query);
    if (!conditionSuccess) {
      res.status(400).json({ message: 'Invalid condition data' });
      return;
    }
    if (!username) {
      res.status(400).json({ message: 'Username is required' });
      return;
    }
    try {
      const user = await this.userUseCase.getUserByUsername(
        username as string,
        conditionData
      );
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const { hash_password, ...rest } = user;
      res
        .status(200)
        .json({ message: 'Get user by username success', data: rest });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { data, success } = IUserLoginDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: 'Wrong username or password' });
      return;
    }
    try {
      const username = await this.userUseCase.login(data);
      if (username) {
        res.locals.username = username;
        next();
      }
    } catch (error) {
      next(error);
      return;
    }
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await this.userUseCase.getUserById(id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json({ message: 'Get user by id success', data: user });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  async getUsers(req: CustomRequest, res: Response) {
    const { success: pagingSuccess, data: pagingData } =
      PagingDTOSchema.safeParse(req.query);
    const { success: conditionSuccess, data: conditionData } =
      IUserConditionSchema.safeParse(req.query);
    if (!pagingSuccess || !conditionSuccess) {
      res.status(400).json({ message: 'Invalid paging or condition data' });
      return;
    }
    try {
      const users = await this.userUseCase.getUsers(pagingData, conditionData);
      if (users.data.length === 0) {
        res.status(404).json({ message: 'No users found' });
        return;
      }
      res.status(200).json({ message: 'Get users success', ...users });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  async createUser(req: Request, res: Response) {
    const { success, data } = IUserCreateDTOSchema.omit({
      hash_password: true,
    }).safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }
    try {
      const user = await this.userUseCase.createUser(data);

      if (!user) {
        res.status(400).json({ message: 'Create user failed' });
        return;
      }
      res.status(200).json({ message: 'Create user success', data: user });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data } = IUserUpdateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }
    try {
      const user = await this.userUseCase.updateUser(id, data);
      if (!user) {
        res.status(400).json({ message: 'Update user failed' });
        return;
      }
      res.status(200).json({ message: 'Update user success', data: user });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const isDeleted = await this.userUseCase.deleteUser(id);
      if (!isDeleted) {
        res.status(400).json({ message: 'Delete user failed' });
        return;
      }
      res.status(200).json({ message: 'Delete user success' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
