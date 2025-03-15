import { WarehouseConditionDTO } from './../../../../../../backend/src/modules/warehouse/models/warehouse.dto';
import { axiosInstance } from '../../utils/axiosInstance';
import { WarehouseCreateDTO, WarehouseUpdateDTO } from '@/app/shared/interfaces/warehouse/warehouse.interface';
import { WarehouseModel } from '@/app/shared/models/warehouse/warehouse.model';
import { ListResponseModel } from '@/app/shared/models/others/list-response.model';

export const warehouseService = {
  async getList(
    condition?: WarehouseConditionDTO,
  ): Promise<ListResponseModel<WarehouseModel>> {
    const response = await axiosInstance.get("/warehouses", { params: condition });
    return response.data;
  },
  async getById(id: string): Promise<WarehouseModel> {
    const response = await axiosInstance.get(`/warehouses/${id}`);
    return response.data;
  },
  async create(data: WarehouseCreateDTO): Promise<WarehouseModel> {
    const response = await axiosInstance.post("/warehouses", data);
    return response.data;
  },
  async update(id: string, data: WarehouseUpdateDTO): Promise<WarehouseModel> {
    const response = await axiosInstance.put(`/warehouses/${id}`, data);
    return response.data;
  },
  async delete(id: string): Promise<boolean> {
    const response = await axiosInstance.delete(`/warehouses/${id}`);
    return response.data;
  },
  async getAll(
    condition?: WarehouseConditionDTO,
  ): Promise<{ data: WarehouseModel[] }> {
    const response = await axiosInstance.get("/warehouses/all", { params: condition });
    return response.data;
  },
};
