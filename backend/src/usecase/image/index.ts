import { ImageCreateDTO, ImageUpdateDTO } from "@models/image/image.dto";
import { IImageRepository } from "@models/image/image.interface";
import { Image } from "@models/image/image.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export class ImageUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async createImage(data: ImageCreateDTO): Promise<Image> {
    return this.imageRepository.insert(data);
  }

  async updateImage(id: string, data: ImageUpdateDTO): Promise<Image> {
    return this.imageRepository.update(id, data);
  }

  async deleteImage(id: string): Promise<boolean> {
    return this.imageRepository.delete(id);
  }

  async getImage(id: string): Promise<Image | null> {
    return this.imageRepository.get(id);
  }

  async listImage(paging: PagingDTO): Promise<ListResponse<Image[]>> {
    return this.imageRepository.list(paging);
  }
}
