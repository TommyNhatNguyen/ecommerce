import { compare, hash } from "bcrypt";
import { ListResponse, ModelStatus } from "src/share/models/base-model";
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD } from "src/modules/user/models/user.error";
import { PagingDTO } from "src/share/models/paging";
import { IUserConditionDTO, IUserCreateDTO, IUserLoginDTO, IUserUpdateDTO } from "src/modules/user/models/user.dto";
import { User } from "src/modules/user/models/user.model";
import { IUserRepository, IUserUseCase } from "src/modules/user/models/user.interface";

export class UserUseCase implements IUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUserByUsername(
    username: string,
    condition?: IUserConditionDTO
  ): Promise<User> {
    return await this.userRepository.getUserByUsername(username, condition);
  }

  async login(data: IUserLoginDTO): Promise<boolean | string> {
    const { username, password } = data;
    // Check if user exist
    const user = await this.getUserByUsername(username);
    if (!user) throw USER_NOT_FOUND_ERROR;
    // Check if password is correct
    const isCorrectPassword = compare(password, user.hash_password);
    if (!isCorrectPassword) throw WRONG_PASSWORD;
    return user?.username;
  }

  getUserById(id: string): Promise<User> {
    return this.userRepository.getUserById(id);
  }
  getUsers(
    paging: PagingDTO,
    condition: IUserConditionDTO
  ): Promise<ListResponse<User[]>> {
    return this.userRepository.getUsers(paging, condition);
  }
  async createUser(data: IUserCreateDTO): Promise<Omit<User, "hash_password">> {
    const { password, ...rest } = data;
    const hash_password = await hash(password, Number(process.env.BCRYPT_SALT));
    const payload: Omit<IUserCreateDTO, "password"> = {
      ...rest,
      hash_password: hash_password,
    };
    return this.userRepository.createUser(payload);
  }
  updateUser(id: string, data: IUserUpdateDTO): Promise<User> {
    return this.userRepository.updateUser(id, data);
  }
  deleteUser(id: string): Promise<boolean> {
    return this.userRepository.deleteUser(id);
  }
}
