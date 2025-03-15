import { PagingDTO } from 'src/share/models/paging';
import {
  WarehouseConditionDTO,
  WarehouseCreateDTO,
  WarehouseUpdateDTO,
} from './warehouse.dto';
import { ListResponse } from 'src/share/models/base-model';
import { Warehouse } from 'src/modules/warehouse/models/warehouse.model';
import { Transaction } from 'sequelize';

export interface IWarehouseUsecase {
  createWarehouse(
    data: WarehouseCreateDTO,
    t?: Transaction
  ): Promise<Warehouse>;
  updateWarehouse(
    id: string,
    data: WarehouseUpdateDTO,
    t?: Transaction
  ): Promise<Warehouse>;
  deleteWarehouse(id: string, t?: Transaction): Promise<boolean>;
  getWarehouseById(
    id: string,
    condition?: WarehouseConditionDTO,
    t?: Transaction
  ): Promise<Warehouse>;
  getWarehouseList(
    paging: PagingDTO,
    condition?: WarehouseConditionDTO
  ): Promise<ListResponse<Warehouse[]>>;
  getAllWarehouse(condition?: WarehouseConditionDTO): Promise<Warehouse[]>;
}

export interface IWarehouseRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  getWarehouseById(
    id: string,
    condition?: WarehouseConditionDTO,
    t?: Transaction
  ): Promise<Warehouse>;
  getWarehouseList(
    paging: PagingDTO,
    condition?: WarehouseConditionDTO
  ): Promise<ListResponse<Warehouse[]>>;
  getAllWarehouse(condition?: WarehouseConditionDTO): Promise<Warehouse[]>;
}

export interface ICommandRepository {
  createWarehouse(
    data: WarehouseCreateDTO,
    t?: Transaction
  ): Promise<Warehouse>;
  updateWarehouse(
    id: string,
    data: WarehouseUpdateDTO,
    t?: Transaction
  ): Promise<Warehouse>;
  deleteWarehouse(id: string, t?: Transaction): Promise<boolean>;
}
