import { ImageCreateDTO, ImageUpdateDTO } from '@models/image/image.dto';
import { Image } from '@models/image/image.model';
import { ListResponse } from 'src/share/models/base-model';
import { Meta, PagingDTO } from 'src/share/models/paging';

export interface IImageUseCase {
  createImage(data: ImageCreateDTO): Promise<Image>;
  updateImage(id: string, data: ImageUpdateDTO): Promise<Image>;
  deleteImage(id: string): Promise<boolean>;
  getImage(id: string): Promise<Image | null>;
  listImage(paging: PagingDTO): Promise<ListResponse<Image[]>>;
}

export interface IImageRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IImageCloudinaryRepository {
  delete(public_id: string): Promise<boolean>;
}

export interface IQueryRepository {
  get(id: string): Promise<Image | null>;
  list(paging: PagingDTO): Promise<ListResponse<Image[]>>;
}

export interface ICommandRepository {
  insert(data: ImageCreateDTO): Promise<Image>;
  update(id: string, data: ImageUpdateDTO): Promise<Image>;
  delete(id: string): Promise<boolean>;
}
