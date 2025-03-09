
import { ImageConditionDTO, ImageUpdateDTO } from "src/modules/image/models/image.dto";
import { ImageCreateDTO } from "src/modules/image/models/image.dto";
import { IImageCloudinaryRepository } from "src/modules/image/models/image.interface";
import { IImageRepository } from "src/modules/image/models/image.interface";
import { IImageUseCase } from "src/modules/image/models/image.interface";
import { Image } from "src/modules/image/models/image.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export class ImageUseCase implements IImageUseCase {
  constructor(private readonly imageRepository: IImageRepository, private readonly cloudinaryImageRepository: IImageCloudinaryRepository) {}

  async createImage(data: ImageCreateDTO): Promise<Image> {
    return this.imageRepository.insert(data);
  }

  async updateImage(id: string, data: ImageUpdateDTO): Promise<Image> {
    return this.imageRepository.update(id, data);
  }

  async deleteImage(id: string): Promise<boolean> {
    const image = await this.imageRepository.get(id);
    if (image?.cloudinary_id) {
      await this.cloudinaryImageRepository.delete(image.cloudinary_id);
    }
    return this.imageRepository.delete(id);
  }

  async getImage(id: string): Promise<Image | null> {
    return this.imageRepository.get(id);
  }

  async listImage(paging: PagingDTO, condition: ImageConditionDTO): Promise<ListResponse<Image[]>> {
    return this.imageRepository.list(paging, condition);
  }
}
