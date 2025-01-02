import { ImageCreateDTO, ImageUpdateDTO } from "@models/image/image.dto";
import { IImageCloudinaryRepository, IImageRepository, IImageUseCase } from "@models/image/image.interface";
import { Image } from "@models/image/image.model";
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

  async listImage(paging: PagingDTO): Promise<ListResponse<Image[]>> {
    return this.imageRepository.list(paging);
  }
}
