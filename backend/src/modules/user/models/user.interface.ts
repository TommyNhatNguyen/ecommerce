
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";
import { User } from "src/modules/user/models/user.model";
import { IUserConditionDTO, IUserCreateDTO, IUserLoginDTO, IUserUpdateDTO } from "src/modules/user/models/user.dto";

export interface IUserUseCase {
  getUserById(id: string): Promise<User>;
  getUsers(
    paging: PagingDTO,
    condition: IUserConditionDTO
  ): Promise<ListResponse<User[]>>;
  createUser(data: Omit<IUserCreateDTO, "hash_password">): Promise<User>;
  updateUser(id: string, data: IUserUpdateDTO): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
  getUserByUsername(username: string, condition?: IUserConditionDTO): Promise<User>;
  login(data: IUserLoginDTO): Promise<boolean | string>;
}

export interface IUserRepository extends IQueryRepository, ICommandRepository {}

export interface IQueryRepository {
  getUserById(id: string): Promise<User>;
  getUsers(
    paging: PagingDTO,
    condition: IUserConditionDTO
  ): Promise<ListResponse<User[]>>;
  getUserByUsername(username: string, condition?: IUserConditionDTO): Promise<User>;
}

export interface ICommandRepository {
  createUser(data: Omit<IUserCreateDTO, "password">): Promise<User>;
  updateUser(id: string, data: IUserUpdateDTO): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
}
