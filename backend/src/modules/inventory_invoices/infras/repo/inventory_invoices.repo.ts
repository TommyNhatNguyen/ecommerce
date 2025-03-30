import {
  Includeable,
  Op,
  QueryTypes,
  Sequelize,
  Transaction,
  WhereOptions,
} from 'sequelize';
import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { InventoryPersistence } from 'src/modules/inventory/infras/repo/postgres/dto';
import {
  InventoryInvoiceConditionDTO,
  InventoryInvoiceCreateCheckInventoryDTO,
  InventoryInvoiceCreateDTO,
  InventoryInvoiceCreateTransferDTO,
  InventoryInvoiceUpdateDTO,
} from 'src/modules/inventory_invoices/models/inventory_invoices.dto';
import { IInventoryInvoiceRepository } from 'src/modules/inventory_invoices/models/inventory_invoices.interface';
import { InventoryInvoice } from 'src/modules/inventory_invoices/models/inventory_invoices.model';
import {
  productSellableModelName,
  ProductSellablePersistence,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import {
  variantModelName,
  VariantPersistence,
} from 'src/modules/variant/infras/repo/postgres/dto';
import { warehouseModelName } from 'src/modules/warehouse/infras/repo/warehouse.dto';
import { WarehousePersistence } from 'src/modules/warehouse/infras/repo/warehouse.dto';
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

  async createCheckInventoryInvoice(
    data: InventoryInvoiceCreateCheckInventoryDTO,
    t?: Transaction
  ): Promise<InventoryInvoice | null> {
    const inventoryInvoice = await this.sequelize.models[this.modelname].create(
      data,
      { transaction: t }
    );
    return inventoryInvoice.dataValues;
  }

  async createTransferInvoice(
    data: InventoryInvoiceCreateTransferDTO,
    t?: Transaction
  ): Promise<InventoryInvoice | null> {
    const inventoryInvoice = await this.sequelize.models[this.modelname].create(
      data,
      { transaction: t }
    );
    return inventoryInvoice.dataValues;
  }

  async getById(
    id: string,
    condition?: InventoryInvoiceConditionDTO,
    t?: Transaction
  ): Promise<InventoryInvoice> {
    const include: Includeable[] = [];
    const inventoryInclude: Includeable[] = [];
    if (condition?.include_product) {
      inventoryInclude.push({
        model: ProductSellablePersistence,
        as: productSellableModelName,
        include: [
          {
            model: VariantPersistence,
            as: variantModelName,
          },
        ],
      });
    }
    if (condition?.include_warehouse) {
      include.push({
        model: WarehousePersistence,
        as: warehouseModelName,
      });
    }
    if (condition?.include_inventory) {
      include.push({
        model: InventoryPersistence,
        as: inventoryModelName,
        include: inventoryInclude,
      });
    }
    const inventoryInvoice = await this.sequelize.models[
      this.modelname
    ].findByPk(id, {
      transaction: t,
      include,
    });
    return inventoryInvoice?.dataValues;
  }
  async getAll(
    condition?: InventoryInvoiceConditionDTO,
    t?: Transaction
  ): Promise<ListResponse<InventoryInvoice[]>> {
    const include: Includeable[] = [];
    const inventoryInclude: Includeable[] = [];
    const where: WhereOptions = {};
    const warehouseWhere: WhereOptions = {};
    if (condition?.warehouse_ids) {
      warehouseWhere.id = {
        [Op.in]: condition.warehouse_ids,
      };
    }
    if (condition?.invoices_types) {
      where.type = {
        [Op.in]: condition.invoices_types,
      };
    }

    if (condition?.include_product) {
      inventoryInclude.push({
        model: ProductSellablePersistence,
        as: productSellableModelName,
        include: [
          {
            model: VariantPersistence,
            as: variantModelName,
          },
        ],
      });
    }
    if (condition?.include_warehouse) {
      include.push({
        model: WarehousePersistence,
        as: warehouseModelName,
        where: warehouseWhere,
        required: warehouseWhere ? true : false,
      });
    }
    if (condition?.include_inventory) {
      include.push({
        model: InventoryPersistence,
        as: inventoryModelName,
        include: inventoryInclude,
      });
    }
    const inventoryInvoices = await this.sequelize.models[
      this.modelname
    ].findAll({
      where: condition,
      include,
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
    const include: Includeable[] = [];
    const inventoryInclude: Includeable[] = [];
    const where: WhereOptions = {};
    const warehouseWhere: WhereOptions = {};
    if (condition?.warehouse_ids) {
      warehouseWhere.id = {
        [Op.in]: condition.warehouse_ids,
      };
    }
    if (condition?.invoices_types) {
      where.type = {
        [Op.in]: condition.invoices_types,
      };
    }
    if (condition?.include_product) {
      inventoryInclude.push({
        model: ProductSellablePersistence,
        as: productSellableModelName,
        include: [
          {
            model: VariantPersistence,
            as: variantModelName,
          },
        ],
      });
    }
    if (condition?.include_warehouse) {
      include.push({
        model: WarehousePersistence,
        as: warehouseModelName,
        where: warehouseWhere,
        required: warehouseWhere ? true : false,
      });
    }
    if (condition?.include_inventory) {
      include.push({
        model: InventoryPersistence,
        as: inventoryModelName,
        include: inventoryInclude,
      });
    }
    const { page, limit } = paging;
    const { sortBy = BaseSortBy.CREATED_AT, orderBy = BaseOrder.DESC } =
      condition || {};
    const offset = (page - 1) * limit;
    const { rows, count } = await this.sequelize.models[
      this.modelname
    ].findAndCountAll({
      where,
      offset,
      limit,
      order: [[sortBy, orderBy]],
      include,
      distinct: true,
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
