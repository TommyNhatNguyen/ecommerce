import { Transaction } from 'sequelize';
import {
  InventoryInvoiceCreateDTO,
  InventoryInvoiceUpdateDTO,
} from 'src/modules/inventory_invoices/models/inventory_invoices.dto';

import { InventoryInvoiceConditionDTO } from 'src/modules/inventory_invoices/models/inventory_invoices.dto';
import { InventoryInvoice } from 'src/modules/inventory_invoices/models/inventory_invoices.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IInventoryInvoiceUseCase {
  getById(
    id: string,
    condition?: InventoryInvoiceConditionDTO,
    t?: Transaction
  ): Promise<InventoryInvoice>;
  getList(
    paging: PagingDTO,
    condition?: InventoryInvoiceConditionDTO
  ): Promise<ListResponse<InventoryInvoice[]>>;
  getAll(
    condition?: InventoryInvoiceConditionDTO,
    t?: Transaction
  ): Promise<ListResponse<InventoryInvoice[]>>;
  create(
    data: InventoryInvoiceCreateDTO,
    t?: Transaction
  ): Promise<InventoryInvoice | null>;
  update(
    id: string,
    data: InventoryInvoiceUpdateDTO,
    t?: Transaction
  ): Promise<InventoryInvoice>;
  delete(id: string, t?: Transaction): Promise<boolean>;
}

export interface IInventoryInvoiceRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  getById(
    id: string,
    condition?: InventoryInvoiceConditionDTO,
    t?: Transaction
  ): Promise<InventoryInvoice>;
  getList(
    paging: PagingDTO,
    condition?: InventoryInvoiceConditionDTO
  ): Promise<ListResponse<InventoryInvoice[]>>;
  getAll(
    condition?: InventoryInvoiceConditionDTO,
    t?: Transaction
  ): Promise<ListResponse<InventoryInvoice[]>>;
}

export interface ICommandRepository {
  create(
    data: InventoryInvoiceCreateDTO,
    t?: Transaction
  ): Promise<InventoryInvoice>;
  update(
    id: string,
    data: InventoryInvoiceUpdateDTO,
    t?: Transaction
  ): Promise<InventoryInvoice>;
  delete(id: string, t?: Transaction): Promise<boolean>;
}
