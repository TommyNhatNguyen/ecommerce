import { BrandConditionDTO, BrandCreateDTO, BrandUpdateDTO } from 'src/modules/brand/models/brand.dto';
import { Brand } from 'src/modules/brand/models/brand.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IBrandUseCase {
  createBrand(data: BrandCreateDTO): Promise<Brand>;
  updateBrand(id: string, data: BrandUpdateDTO): Promise<Brand>;
  deleteBrand(id: string): Promise<boolean>;
  getBrand(id: string, condition?: BrandConditionDTO): Promise<Brand | null>;
  listBrand(
    paging: PagingDTO,
    condition?: BrandConditionDTO
  ): Promise<ListResponse<Brand[]>>;
  getAllBrand(condition?: BrandConditionDTO): Promise<Brand[]>;
}

export interface IBrandRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  get(id: string, condition?: BrandConditionDTO): Promise<Brand | null>;
  list(
    paging: PagingDTO,
    condition?: BrandConditionDTO
  ): Promise<ListResponse<Brand[]>>;
  getAll(condition?: BrandConditionDTO): Promise<Brand[]>;
}

export interface ICommandRepository {
  insert(data: BrandCreateDTO): Promise<Brand>;
  update(id: string, data: BrandUpdateDTO): Promise<Brand>;
  delete(id: string): Promise<boolean>;
}
