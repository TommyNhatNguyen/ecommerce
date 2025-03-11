import { Sequelize, Transaction } from 'sequelize';
import {
  InventoryInvoiceConditionDTO,
  InventoryInvoiceCreateDTO,
  InventoryInvoiceUpdateDTO,
} from 'src/modules/inventory_invoices/models/inventory_invoices.dto';
import { IInventoryInvoiceRepository } from 'src/modules/inventory_invoices/models/inventory_invoices.interface';
import { InventoryInvoice } from 'src/modules/inventory_invoices/models/inventory_invoices.model';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class InventoryInvoiceRepository implements IInventoryInvoiceRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelname: string
  ) {}
  async getById(
    id: string,
    condition?: InventoryInvoiceConditionDTO,
    t?: Transaction
  ): Promise<InventoryInvoice> {
    const inventoryInvoice = await this.sequelize.models[
      this.modelname
    ].findByPk(id, {
      transaction: t,
    });
    return inventoryInvoice?.dataValues;
  }
  async getAll(
    condition?: InventoryInvoiceConditionDTO,
    t?: Transaction
  ): Promise<ListResponse<InventoryInvoice[]>> {
    const inventoryInvoices = await this.sequelize.models[
      this.modelname
    ].findAll({
      where: condition,
      transaction: t,
    });
    return {
      data: inventoryInvoices.map((row) => row.dataValues),
      meta: {
        total_count: inventoryInvoices.length,
        current_page: 1,
        total_page: 1,
        limit: inventoryInvoices.length,
      },
    };
  }
  async getList(
    paging: PagingDTO,
    condition?: InventoryInvoiceConditionDTO
  ): Promise<ListResponse<InventoryInvoice[]>> {
    const { page, limit } = paging;
    const { sortBy = BaseSortBy.CREATED_AT, orderBy = BaseOrder.DESC } =
      condition || {};
    const offset = (page - 1) * limit;
    const { rows, count } = await this.sequelize.models[
      this.modelname
    ].findAndCountAll({
      where: condition,
      offset,
      limit,
      order: [[sortBy, orderBy]],
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        total_count: count,
        current_page: page,
        total_page: Math.ceil(count / limit),
        limit,
      },
    };
  }
  async create(
    data: InventoryInvoiceCreateDTO,
    t?: Transaction
  ): Promise<InventoryInvoice> {
    const inventoryInvoice = await this.sequelize.models[this.modelname].create(
      data,
      {
        transaction: t,
      }
    );
    return inventoryInvoice.dataValues;
  }
  async update(
    id: string,
    data: InventoryInvoiceUpdateDTO,
    t?: Transaction
  ): Promise<InventoryInvoice> {
    const inventoryInvoice = await this.sequelize.models[this.modelname].update(
      data,
      {
        where: { id },
        transaction: t,
        returning: true,
      }
    );
    return inventoryInvoice[1][0].dataValues;
  }
  async delete(id: string, t?: Transaction): Promise<boolean> {
    const inventoryInvoice = await this.sequelize.models[
      this.modelname
    ].destroy({
      where: { id },
      transaction: t,
    });
    return inventoryInvoice > 0;
  }
}
