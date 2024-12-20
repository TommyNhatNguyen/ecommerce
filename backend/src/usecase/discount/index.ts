import { DiscountConditionDTOSchema, DiscountCreateDTOSchema, DiscountUpdateDTOSchema } from "@models/discount/discount.dto";
import { IDiscountRepository, IDiscountUseCase } from "@models/discount/discount.interface";
import { Discount } from "@models/discount/discount.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export class DiscountUseCase implements IDiscountUseCase {
  constructor(private readonly repository: IDiscountRepository) {}
  async listDiscount(
    paging: PagingDTO,
    condition: DiscountConditionDTOSchema
  ): Promise<ListResponse<Discount[]>> {
    return await this.repository.list(paging, condition);
  }
  async getDiscount(id: string): Promise<Discount | null> {
    return await this.repository.get(id);
  }
  async createDiscount(data: DiscountCreateDTOSchema): Promise<Discount> {
    return await this.repository.insert(data);
  }
  async updateDiscount(
    id: string,
    data: DiscountUpdateDTOSchema
  ): Promise<Discount> {
    return await this.repository.update(id, data);
  }
  async deleteDiscount(id: string): Promise<boolean> {
    await this.repository.delete(id);
    return true;
  }
}
