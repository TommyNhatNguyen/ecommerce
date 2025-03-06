import { NextFunction, Request, Response } from "express";
import { CustomRequest, JWT_TYPES } from "src/middlewares/jwt";
import {
  CustomerConditionDTOSchema,
  CustomerCreateDTOSchema,
  CustomerUpdateDTOSchema,
  ICustomerLoginDTOSchema,
} from "src/modules/customer/models/customer.dto";
import { ICustomerUseCase } from "src/modules/customer/models/customer.interface";
import { PagingDTOSchema } from "src/share/models/paging";

export class CustomerHttpService {
  constructor(private readonly customerUseCase: ICustomerUseCase) {}
  async getCustomerByUsername(req: CustomRequest, res: Response) {
    console.log('🚀 ~ CustomerHttpService ~ req.data:', req.data);
    const username = req.data?.data;
    const { data: conditionData, success: conditionSuccess } =
      CustomerConditionDTOSchema.safeParse(req.query);
    if (!conditionSuccess) {
      res.status(400).json({ message: "Invalid condition data" });
      return;
    }
    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }
    try {
      const user = await this.customerUseCase.getCustomerByUsername(
        username as string,
        conditionData
      );
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const { hash_password, ...rest } = user;
      res
        .status(200)
        .json({ message: "Get user by username success", data: rest });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    const { data, success } = ICustomerLoginDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: "Wrong username or password" });
      return;
    }
    try {
      const username = await this.customerUseCase.loginCustomer(data);
      if (username) {
        res.locals.username = username;
        res.locals.type = JWT_TYPES.CUSTOMER;
        next();
      }
    } catch (error) {
      console.log(error);
      next(error);
      return;
    }
  }
  async getCustomerList(req: Request, res: Response) {
    const {
      success: pagingSuccess,
      data: pagingData,
      error: pagingError,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: conditionSuccess,
      data: conditionData,
      error: conditionError,
    } = CustomerConditionDTOSchema.safeParse(req.body);
    if (!pagingSuccess || !conditionSuccess) {
      res.status(400).json({ message: "Invalid paging or condition" });
      return;
    }
    try {
      const customerList = await this.customerUseCase.getCustomerList(
        pagingData,
        conditionData
      );
      if (!customerList) {
        res.status(404).json({ message: "Customer not found" });
        return;
      }
      res.status(200).json({
        message: "Customer list fetched successfully",
        ...customerList,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
  async getCustomerById(req: Request, res: Response) {
    const { id } = req.params;
    const {
      success: conditionSuccess,
      data: conditionData,
      error: conditionError,
    } = CustomerConditionDTOSchema.safeParse(req.body);
    if (!conditionSuccess) {
      res.status(400).json({ message: "Invalid condition" });
      return;
    }
    try {
      const customer = await this.customerUseCase.getCustomerById(
        id,
        conditionData
      );
      if (!customer) {
        res.status(404).json({ message: "Customer not found" });
        return;
      }
      res.status(200).json({
        message: "Customer fetched successfully",
        ...customer,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
  async createCustomer(req: Request, res: Response) {
    const {
      success: dataSuccess,
      data: dataData,
      error: dataError,
    } = CustomerCreateDTOSchema.omit({
      cart_id: true,
      hash_password: true,
    }).safeParse(req.body);
    if (!dataSuccess) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }
    try {
      const customer = await this.customerUseCase.createCustomer(dataData);
      if (!customer) {
        res.status(404).json({ message: "Customer not found" });
        return;
      }
      res.status(200).json({
        message: "Customer created successfully",
        ...customer,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
  async updateCustomer(req: Request, res: Response) {
    const { id } = req.params;
    const {
      success: dataSuccess,
      data: dataData,
      error: dataError,
    } = CustomerUpdateDTOSchema.safeParse(req.body);
    if (!dataSuccess) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }
    try {
      const customer = await this.customerUseCase.updateCustomer(id, dataData);
      if (!customer) {
        res.status(404).json({ message: "Customer not found" });
        return;
      }
      res.status(200).json({
        message: "Customer updated successfully",
        ...customer,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
  async deleteCustomer(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deletedCustomer = await this.customerUseCase.getCustomerById(
        id,
        {}
      );
      if (!deletedCustomer) {
        res.status(404).json({ message: "Customer not found" });
        return;
      }
      await this.customerUseCase.deleteCustomer(id);
      res.status(200).json({
        message: "Customer deleted successfully",
        ...deletedCustomer,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
}
