
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";
import { User } from "src/modules/user/models/user.model";
import { IUserConditionDTO, IUserCreateDTO, IUserLoginDTO, IUserUpdateDTO } from "src/modules/user/models/user.dto";
import { Transaction } from "sequelize";

export interface IUserUseCase {
  getUserById(id: string, condition?: IUserConditionDTO): Promise<Omit<User, "hash_password">>;
  getUsers(
    paging: PagingDTO,
    condition: IUserConditionDTO
  ): Promise<ListResponse<Omit<User, "hash_password">[]>>;
  createUser(data: Omit<IUserCreateDTO, "hash_password">): Promise<Omit<User, "hash_password">>;
  updateUser(id: string, data: IUserUpdateDTO): Promise<Omit<User, "hash_password">>;
  deleteUser(id: string): Promise<boolean>;
  getUserByUsername(username: string, condition?: IUserConditionDTO, t?: Transaction): Promise<User>;
  login(data: IUserLoginDTO): Promise<boolean | string>;
}

export interface IUserRepository extends IQueryRepository, ICommandRepository {}

export interface IQueryRepository {
  getUserById(id: string, condition?: IUserConditionDTO): Promise<Omit<User, "hash_password">>;
  getUsers(
    paging: PagingDTO,
    condition: IUserConditionDTO
  ): Promise<ListResponse<Omit<User, "hash_password">[]>>;
  getUserByUsername(username: string, condition?: IUserConditionDTO, t?: Transaction): Promise<User>;
}

export interface ICommandRepository {
  createUser(data: Omit<IUserCreateDTO, "password">): Promise<Omit<User, "hash_password">>;
  updateUser(id: string, data: IUserUpdateDTO): Promise<Omit<User, "hash_password">>;
  deleteUser(id: string): Promise<boolean>;
}
