import { Op, Sequelize, where, WhereOptions } from 'sequelize';
import { ImageConditionDTO, ImageCreateDTO, ImageUpdateDTO } from 'src/modules/image/models/image.dto';
import { IImageCloudinaryRepository, IImageRepository } from 'src/modules/image/models/image.interface';
import { Image } from 'src/modules/image/models/image.model';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

// export class CloudinaryImageRepository implements IImageRepository {
//   constructor(private readonly cloudinary: Cloudinary) {}
// }

export class PostgresImageRepository implements IImageRepository {
  constructor(
    private readonly squelize: Sequelize,
    private readonly modelName: string
  ) {}
  async get(id: string): Promise<Image | null> {
    const image = await this.squelize.models[this.modelName].findByPk(id);
    return image?.dataValues;
  }
  async list(
    paging: PagingDTO,
    condition: ImageConditionDTO
  ): Promise<ListResponse<Image[]>> {
    const where: WhereOptions = {};
    const { limit, page } = paging;
    const order = condition.orderBy || BaseOrder.DESC;
    const sortBy = condition.sortBy || BaseSortBy.CREATED_AT;
    if (condition.typeList && condition.typeList.length > 0) {
      where.type = {
        [Op.in]: condition.typeList,
      };
    }
    const { rows, count } = await this.squelize.models[
      this.modelName
    ].findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, order]],
    });
    return {
      data: rows.map((image) => image.dataValues),
      meta: {
        total_count: count,
        current_page: page,
        total_page: Math.ceil(count / limit),
        limit,
      },
    };
  }
  async insert(data: ImageCreateDTO): Promise<Image> {
    const image = await this.squelize.models[this.modelName].create(data, {
      returning: true,
    });
    return image.dataValues;
  }
  async update(id: string, data: ImageUpdateDTO): Promise<Image> {
    const image = await this.squelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return image[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    await this.squelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}

export class CloudinaryImageRepository implements IImageCloudinaryRepository {
  constructor(private readonly cloudinary: any) {}
  async delete(public_id: string): Promise<boolean> {
    await this.cloudinary.uploader.destroy(public_id);
    return true;
  }
}
