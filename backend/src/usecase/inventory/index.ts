import { InventoryConditionDTO, InventoryCreateDTO, InventoryUpdateDTO } from "@models/inventory/inventory.dto";
import { InventoryRepository } from "@models/inventory/inventory.interface";
import { Inventory } from "@models/inventory/inventory.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export class InventoryUseCase implements InventoryUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async getInventoryById(id: string): Promise<Inventory> {
    return await this.inventoryRepository.get(id);
  }

  async getInventoryList(
    paging: PagingDTO,
    condition: InventoryConditionDTO
  ): Promise<ListResponse<Inventory[]>> {
    return await this.inventoryRepository.list(paging, condition);
  }

  async createInventory(data: InventoryCreateDTO): Promise<Inventory> {
    return await this.inventoryRepository.create(data);
  }

  async updateInventory(id: string, data: InventoryUpdateDTO): Promise<Inventory> {
    return await this.inventoryRepository.update(id, data);
  }

  async deleteInventory(id: string): Promise<boolean> {
    return await this.inventoryRepository.delete(id);
  }
}
