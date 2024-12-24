import {
  IUserConditionDTO,
  IUserCreateDTO,
  IUserUpdateDTO,
} from '@models/user/user.dto';
import { User } from '@models/user/user.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IUserUseCase {
  getUserById(id: string): Promise<User>;
  getUsers(
    paging: PagingDTO,
    condition: IUserConditionDTO
  ): Promise<ListResponse<User[]>>;
  createUser(data: IUserCreateDTO): Promise<User>;
  updateUser(id: string, data: IUserUpdateDTO): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
}

export interface IUserRepository extends IQueryRepository, ICommandRepository {}

export interface IQueryRepository {
  getUserById(id: string): Promise<User>;
  getUsers(
    paging: PagingDTO,
    condition: IUserConditionDTO
  ): Promise<ListResponse<User[]>>;
}

export interface ICommandRepository {
  createUser(data: IUserCreateDTO): Promise<User>;
  updateUser(id: string, data: IUserUpdateDTO): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
}
