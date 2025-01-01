import { ImageCreateDTO, ImageUpdateDTO } from '@models/image/image.dto';
import { IImageRepository } from '@models/image/image.interface';
import { Image } from '@models/image/image.model';
import { Sequelize, where } from 'sequelize';
import { ListResponse } from 'src/share/models/base-model';
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
  async list(paging: PagingDTO): Promise<ListResponse<Image[]>> {
    const { limit, page } = paging;
    const offset = (page - 1) * limit;
    const images = await this.squelize.models[this.modelName].findAll({
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });
    return {
      data: images.map((image) => image.dataValues),
      meta: {
        total_count: images.length,
        total_page: Math.ceil(images.length / limit),
        current_page: page,
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