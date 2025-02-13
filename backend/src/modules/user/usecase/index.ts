import { compare, hash } from "bcrypt";
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
  ModelStatus,
} from "src/share/models/base-model";
import {
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD,
} from "src/modules/user/models/user.error";
import { PagingDTO } from "src/share/models/paging";
import {
  IUserConditionDTO,
  IUserCreateDTO,
  IUserLoginDTO,
  IUserUpdateDTO,
} from "src/modules/user/models/user.dto";
import { User } from "src/modules/user/models/user.model";
import {
  IUserRepository,
  IUserUseCase,
} from "src/modules/user/models/user.interface";
import { IImageCloudinaryRepository } from "@models/image/image.interface";

export class UserUseCase implements IUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cloudinaryImageRepository: IImageCloudinaryRepository
  ) {}

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
    const isCorrectPassword = await compare(password, user.hash_password);
    if (!isCorrectPassword) throw WRONG_PASSWORD;
    return user?.username;
  }

  getUserById(
    id: string,
    condition?: IUserConditionDTO
  ): Promise<Omit<User, "hash_password">> {
    return this.userRepository.getUserById(id, condition);
  }
  getUsers(
    paging: PagingDTO,
    condition: IUserConditionDTO
  ): Promise<ListResponse<Omit<User, "hash_password">[]>> {
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
  async updateUser(
    id: string,
    data: IUserUpdateDTO
  ): Promise<Omit<User, "hash_password">> {
    const updatedUser = await this.userRepository.getUserById(id, {
      include_image: true,
      order: BaseOrder.DESC,
      sortBy: BaseSortBy.CREATED_AT,
    });
    if (updatedUser?.image_id) {
      await this.cloudinaryImageRepository.delete(updatedUser.image_id);
    }
    const user = await this.userRepository.updateUser(id, data);
    return user;
  }
  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.getUserById(id, {
      include_image: true,
      order: BaseOrder.DESC,
      sortBy: BaseSortBy.CREATED_AT,
    });
    if (user?.image_id) {
      await this.cloudinaryImageRepository.delete(user.image_id);
    }
    return await this.userRepository.deleteUser(id);
  }
}
