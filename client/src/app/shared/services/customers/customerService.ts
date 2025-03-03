import { CustomerRegisterDTO } from "@/app/shared/interfaces/customers/customers.dto";
import { CustomerLoginDTO } from "./../../interfaces/customers/customers.dto.d";
import { CustomerConditionDTO } from "../../interfaces/customers/customers.dto";
import { CustomerModel } from "./../../models/customers/customers.model.d";
import { ListResponseModel } from "../../models/others/list-response.model";
import { axiosInstance } from "../../utils/axiosInstance";
import { TokenModel } from "../../models/auth/auth.model";
import { RefreshTokenDTO } from "@/app/shared/interfaces/auth/auth.dto";

export const customerService = {
  async getList(
    condition?: CustomerConditionDTO,
  ): Promise<ListResponseModel<CustomerModel>> {
    const response = await axiosInstance.get("/customer", {
      params: condition,
    });
    return response.data;
  },
  async login(
    payload: CustomerLoginDTO,
  ): Promise<{ data: TokenModel; message: string }> {
    const response = await axiosInstance.post("/customer-login", payload);
    return response.data;
  },
  async getCustomerInfo(
    query: CustomerConditionDTO,
  ): Promise<{ data: CustomerModel; message: string }> {
    const response = await axiosInstance.get("/customer-info", {
      params: query,
    });
    return response.data;
  },
  async register(payload: CustomerRegisterDTO): Promise<CustomerModel> {
    const response = await axiosInstance.post("/customer", payload);
    return response.data;
  },
  async refreshToken(payload: RefreshTokenDTO): Promise<TokenModel> {
    const response = await axiosInstance.post(
      "/customer/refresh-token",
      payload,
    );
    return response.data;
  },
};
