import { BrandUpdateDTO } from 'src/modules/brand/models/brand.dto';
import {
  BrandConditionDTO,
  BrandCreateDTO,
} from 'src/modules/brand/models/brand.dto';
import { IBrandRepository } from 'src/modules/brand/models/brand.interface';

import { IBrandUseCase } from 'src/modules/brand/models/brand.interface';
import { Brand } from 'src/modules/brand/models/brand.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class BrandUseCase implements IBrandUseCase {
  constructor(private readonly brandRepository: IBrandRepository) {}
  async createBrand(data: BrandCreateDTO): Promise<Brand> {
    return await this.brandRepository.insert(data);
  }
  async updateBrand(id: string, data: BrandUpdateDTO): Promise<Brand> {
    return await this.brandRepository.update(id, data);
  }
  async deleteBrand(id: string): Promise<boolean> {
    return await this.brandRepository.delete(id);
  }
  async getBrand(
    id: string,
    condition?: BrandConditionDTO
  ): Promise<Brand | null> {
    return await this.brandRepository.get(id, condition);
  }
  async listBrand(
    paging: PagingDTO,
    condition: BrandConditionDTO
  ): Promise<ListResponse<Brand[]>> {
    return await this.brandRepository.list(paging, condition);
  }
}

export default BrandUseCase;
