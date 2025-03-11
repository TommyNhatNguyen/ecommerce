import { Transaction } from "sequelize";
import { InventoryInvoiceConditionDTO, InventoryInvoiceCreateDTO, InventoryInvoiceUpdateDTO } from "src/modules/inventory_invoices/models/inventory_invoices.dto";
import { INVENTORY_INVOICE_NOT_FOUND } from "src/modules/inventory_invoices/models/inventory_invoices.errors";
import { IInventoryInvoiceRepository, IInventoryInvoiceUseCase } from "src/modules/inventory_invoices/models/inventory_invoices.interface";
import { InventoryInvoice } from "src/modules/inventory_invoices/models/inventory_invoices.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export class InventoryInvoiceUseCase implements IInventoryInvoiceUseCase {
  constructor(
    private readonly inventoryInvoiceRepository: IInventoryInvoiceRepository
  ) {}
  async getById(id: string, condition?: InventoryInvoiceConditionDTO, t?: Transaction): Promise<InventoryInvoice> {
    const inventoryInvoice = await this.inventoryInvoiceRepository.getById(id, condition, t);
    if (!inventoryInvoice) {
      throw INVENTORY_INVOICE_NOT_FOUND
    }
    return inventoryInvoice;
  }
  async getList(paging: PagingDTO, condition?: InventoryInvoiceConditionDTO): Promise<ListResponse<InventoryInvoice[]>> {
    const inventoryInvoices = await this.inventoryInvoiceRepository.getList(paging, condition);
    return inventoryInvoices;
  }
  async getAll(condition?: InventoryInvoiceConditionDTO, t?: Transaction): Promise<ListResponse<InventoryInvoice[]>> {
    const inventoryInvoices = await this.inventoryInvoiceRepository.getAll(condition, t);
    return inventoryInvoices;
  }
  async create(data: InventoryInvoiceCreateDTO, t?: Transaction): Promise<InventoryInvoice> {
    const inventoryInvoice = await this.inventoryInvoiceRepository.create(data, t);
    return inventoryInvoice;
  }
  async update(id: string, data: InventoryInvoiceUpdateDTO, t?: Transaction): Promise<InventoryInvoice> {
    const inventoryInvoice = await this.inventoryInvoiceRepository.update(id, data, t);
    return inventoryInvoice;
  }
  async delete(id: string, t?: Transaction): Promise<boolean> {
    const inventoryInvoice = await this.inventoryInvoiceRepository.delete(id, t);
    return inventoryInvoice;
  }
}