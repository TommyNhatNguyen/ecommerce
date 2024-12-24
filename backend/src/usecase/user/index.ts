import {
  IUserConditionDTO,
  IUserCreateDTO,
  IUserUpdateDTO,
} from '@models/user/user.dto';
import { IUserRepository, IUserUseCase } from '@models/user/user.interface';
import { User } from '@models/user/user.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class UserUseCase implements IUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  getUserById(id: string): Promise<User> {
    return this.userRepository.getUserById(id);
  }
  getUsers(
    paging: PagingDTO,
    condition: IUserConditionDTO
  ): Promise<ListResponse<User[]>> {
    return this.userRepository.getUsers(paging, condition);
  }
  createUser(data: IUserCreateDTO): Promise<User> {
    return this.userRepository.createUser(data);
  }
  updateUser(id: string, data: IUserUpdateDTO): Promise<User> {
    return this.userRepository.updateUser(id, data);
  }
  deleteUser(id: string): Promise<boolean> {
    return this.userRepository.deleteUser(id);
  }
}
