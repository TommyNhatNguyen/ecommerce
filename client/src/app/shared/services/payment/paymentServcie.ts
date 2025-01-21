import { PaymentMethodConditionDTO } from "@/app/shared/interfaces/payment/payment.dto";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { PaymentMethodModel } from "@/app/shared/models/payment/payment.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const paymentService = {
  async getListPaymentMethod(
    query: PaymentMethodConditionDTO,
  ): Promise<ListResponseModel<PaymentMethodModel>> {
    const response = await axiosInstance.get("/payment-method", { params: query });
    return response.data;
  },
};
