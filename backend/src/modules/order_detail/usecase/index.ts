import { PostgresCustomerRepository } from 'src/modules/customer/infras/repo/postgres/customer.repo';
import { IOrderDetailRepository } from 'src/modules/order_detail/models/order_detail.interface';
import {
  OrderDetailAddCostsDTO,
  OrderDetailAddDiscountsDTO,
  OrderDetailAddProductsDTO,
  OrderDetailConditionDTO,
  OrderDetailCreateDTO,
  OrderDetailUpdateDTO,
} from 'src/modules/order_detail/models/order_detail.dto';
import { IOrderDetailUseCase } from 'src/modules/order_detail/models/order_detail.interface';
import { OrderDetail } from 'src/modules/order_detail/models/order_detail.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { ICustomerUseCase } from 'src/modules/customer/models/customer.interface';
import {
  ORDER_DETAIL_DISCOUNT_DATE_ERROR,
  ORDER_DETAIL_DISCOUNT_ERROR,
  ORDER_DETAIL_DISCOUNT_REQUIRE_ORDER_AMOUNT_ERROR,
  ORDER_DETAIL_DISCOUNT_REQUIRE_PRODUCT_COUNT_ERROR,
  ORDER_DETAIL_ERROR,
  ORDER_DETAIL_MAX_DISCOUNT_COUNT_ERROR,
  ORDER_DETAIL_PRODUCT_ERROR,
  ORDER_DETAIL_PRODUCT_OUT_OF_STOCK_ERROR,
} from 'src/modules/order_detail/models/order_detail.error';
import { IShippingUseCase } from 'src/modules/shipping/models/shipping.interface';
import { IPaymentUseCase } from 'src/modules/payment/models/payment.interface';
import { IPaymentMethodUseCase } from 'src/modules/payment_method/models/payment_method.interface';
import { ICostUseCase } from 'src/modules/cost/models/cost.interface';
import { IDiscountUseCase } from 'src/modules/discount/models/discount.interface';
import { IProductUseCase } from 'src/modules/products/models/product.interface';
import {
  Discount,
  DiscountScope,
  DiscountType,
} from 'src/modules/discount/models/discount.model';
import { IProductSellableUseCase } from 'src/modules/product_sellable/models/product-sellable.interface';
import { StockStatus } from 'src/modules/inventory/models/inventory.model';
import { IInventoryUseCase } from 'src/modules/inventory/models/inventory.interface';
import { checkSufficientInventory } from 'src/modules/order_detail/usecase/checkSufficientInventory';
import { Sequelize } from 'sequelize';
import { DiscountCalculatorUsecaseImpl } from './DiscountCalculatorUsecase';

export class OrderDetailUseCase implements IOrderDetailUseCase {
  constructor(
    private readonly orderDetailRepository: IOrderDetailRepository,
    private readonly orderDetailProductRepository: IOrderDetailRepository,
    private readonly orderDetailDiscountRepository: IOrderDetailRepository,
    private readonly orderDetailCostRepository: IOrderDetailRepository,
    private readonly customerUseCase: ICustomerUseCase,
    private readonly productSellableUseCase: IProductSellableUseCase,
    private readonly shippingUseCase: IShippingUseCase,
    private readonly paymentUseCase: IPaymentUseCase,
    private readonly paymentMethodUseCase: IPaymentMethodUseCase,
    private readonly costUseCase: ICostUseCase,
    private readonly discountUseCase: IDiscountUseCase,
    private readonly inventoryUseCase: IInventoryUseCase,
    private readonly sequelize: Sequelize
  ) {}
  async getById(
    id: string,
    condition: OrderDetailConditionDTO
  ): Promise<OrderDetail> {
    return await this.orderDetailRepository.getById(id, condition);
  }
  async getList(
    paging: PagingDTO,
    condition: OrderDetailConditionDTO
  ): Promise<ListResponse<OrderDetail[]>> {
    return await this.orderDetailRepository.getList(paging, condition);
  }
  async create(data: OrderDetailCreateDTO): Promise<OrderDetail> {
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const {
          products_detail,
          customer_id,
          payment_info,
          costs_detail,
          order_discounts,
          ...rest
        } = data;
        const orderDetailProducts: OrderDetailAddProductsDTO[] = [];
        const orderDetailDiscounts: OrderDetailAddDiscountsDTO[] = [];
        const orderDetailCosts: OrderDetailAddCostsDTO[] = [];
        const payload = {
          ...rest,
          customer_id: customer_id || '',
        };

        // ---- PRODUCTS ----
        if (products_detail.length > 0) {
          const productIds = products_detail.map((product) => product.id);
          const products =
            await this.productSellableUseCase.getProductSellables(
              {
                variant_ids: productIds,
                includeDiscount: true,
              },
              { page: 1, limit: products_detail.length }
            );
          const isSufficientInventory = products.data.every((product) => {
            const orderQuantity =
              products_detail.find((item) => item.id === product.variant_id)
                ?.quantity ?? 0;
            return checkSufficientInventory(
              product.inventory?.quantity ?? 0,
              orderQuantity
            );
          });
          if (!isSufficientInventory) {
            throw ORDER_DETAIL_PRODUCT_OUT_OF_STOCK_ERROR;
          } else {
            const response = await Promise.all(
              products.data.map(async (product) => {
                const orderQuantity =
                  products_detail.find((item) => item.id === product.variant_id)
                    ?.quantity ?? 0;
                return await this.inventoryUseCase.updateInventoryQuantity(
                  product.id,
                  {
                    quantity:
                      (product.inventory?.quantity ?? 0) - orderQuantity,
                  },
                  t
                );
              })
            );
          }
          if (products.data.length !== products_detail.length) {
            throw ORDER_DETAIL_PRODUCT_ERROR;
          }
          payload.subtotal = products.data.reduce((acc, product) => {
            const productDetail = products_detail.find(
              (p) => p.id === product.variant_id
            );
            if (!productDetail) throw ORDER_DETAIL_PRODUCT_ERROR;
            return acc + product.price * (productDetail?.quantity ?? 0);
          }, 0);
          const discountAmountList: { [key: string]: number } = {};
          products.data.forEach((product) => {
            const productDetail = products_detail.find(
              (p) => p.id === product.variant_id
            );
            if (!productDetail) throw ORDER_DETAIL_PRODUCT_ERROR;

            // Filter valid discounts
            const applyDiscountList: Discount[] = product.discount
              ? product.discount.filter((item) => {
                  const isDayValid =
                    new Date(item.start_date) >= new Date() &&
                    new Date(item.end_date) >= new Date(item.start_date);

                  if (!isDayValid) throw ORDER_DETAIL_DISCOUNT_DATE_ERROR;
                  return true;
                })
              : [];

            // Calculate total discount using DiscountCalculator
            const discountAmount = applyDiscountList.reduce(
              (totalDiscount, discount) => {
                const calculator = new DiscountCalculatorUsecaseImpl(
                  discount,
                  this.discountUseCase
                );

                let discountAmount = 0;
                if (discount.is_require_product_count) {
                  discountAmount = calculator.requireProductCountAmount(
                    productDetail.quantity,
                    product.price,
                    discount.has_max_discount_count
                  );
                } else if (discount.has_max_discount_count) {
                  discountAmount = calculator.maxDiscountCountAmount(
                    productDetail.quantity,
                    product.price
                  );
                } else {
                  discountAmount = calculator.calculateDiscountAmount(
                    productDetail.quantity,
                    product.price
                  );
                }

                return totalDiscount + discountAmount;
              },
              0
            );
            discountAmountList[product.variant_id] = discountAmount;
          });
          orderDetailProducts.push(
            ...products.data.map((product, index) => ({
              order_detail_id: '',
              product_sellable_id: product.id,
              quantity:
                products_detail.find((p) => p.id === product.variant_id)
                  ?.quantity ?? 0,
              price: product.price,
              subtotal:
                product.price *
                (products_detail.find((p) => p.id === product.variant_id)
                  ?.quantity ?? 0),
              discount_amount: discountAmountList[product.variant_id],
              total:
                product.price *
                  (products_detail.find((p) => p.id === product.variant_id)
                    ?.quantity ?? 0) -
                discountAmountList[product.variant_id],
            }))
          );
        }
        // ---- CUSTOMER ----
        if (!customer_id) {
          const newCustomer = await this.customerUseCase.createCustomer(
            {
              first_name: rest.customer_firstName || '',
              last_name: rest.customer_lastName,
              phone: rest.customer_phone,
              address: rest.customer_address,
              email: rest.customer_email,
            },
            t
          );
          if (newCustomer) {
            payload.customer_id = newCustomer.id;
          }
        }
        // ---- SHIPPING ----
        if (payload.shipping_method_id) {
          const shipping = await this.shippingUseCase.getShippingById(
            payload.shipping_method_id
          );
          payload.total_shipping_fee = shipping?.cost ?? 0;
        }
        // ---- COSTS ----
        if (costs_detail && costs_detail.length > 0) {
          const costs = await this.costUseCase.getList(
            { page: 1, limit: costs_detail.length },
            {
              ids: costs_detail,
            }
          );
          if (costs.data.length !== costs_detail.length)
            throw ORDER_DETAIL_ERROR;
          payload.total_costs =
            costs.data.reduce((acc, cost) => {
              return acc + cost.cost;
            }, 0) || 0;
          orderDetailCosts.push(
            ...costs.data.map((cost) => ({
              order_detail_id: '',
              cost_id: cost.id,
            }))
          );
        }
        // ---- PAYMENT ----
        if (payment_info?.payment_method_id) {
          const paymentMethod = await this.paymentMethodUseCase.getById(
            payment_info?.payment_method_id
          );
          if (!paymentMethod) throw ORDER_DETAIL_ERROR;
          payload.total_payment_fee = paymentMethod?.cost ?? 0;
          const payment = await this.paymentUseCase.createPayment(
            {
              paid_amount: payment_info?.paid_amount ?? 0,
              payment_method_id: payment_info?.payment_method_id,
              paid_all_date:
                payment_info?.paid_amount === payload.total ? new Date() : null,
            },
            t
          );
          payload.payment_id = payment.id;
        }
        // ---- DISCOUNTS ----
        if (order_discounts && order_discounts.length > 0) {
          const discounts = await this.discountUseCase.listDiscount(
            { page: 1, limit: order_discounts.length },
            { ids: order_discounts, scope: DiscountScope.ORDER }
          );
          if (discounts.data.length !== order_discounts.length) {
            throw ORDER_DETAIL_DISCOUNT_ERROR;
          }
          const totalProductQuantity = orderDetailProducts.reduce(
            (acc, product) => acc + product.quantity,
            0
          );

          payload.total_order_discount = discounts.data.reduce(
            (totalDiscount, discount) => {
              const calculator = new DiscountCalculatorUsecaseImpl(
                discount,
                this.discountUseCase
              );

              const discountAmount = calculator.requireOrderAmount(
                payload.subtotal,
                discount.has_max_discount_count,
                discount.is_require_order_amount,
                totalProductQuantity
              );

              return totalDiscount + discountAmount;
            },
            0
          );
          payload.total_product_discount = orderDetailProducts.reduce(
            (acc, product) => acc + product.discount_amount,
            0
          );
          payload.total_discount =
            payload.total_order_discount + payload.total_product_discount;

          orderDetailDiscounts.push(
            ...discounts.data.map((discount) => ({
              order_detail_id: '',
              discount_id: discount.id,
            }))
          );
        }
        console.log(payload);
        payload.total =
          (payload.subtotal || 0) +
          ((payload.total_shipping_fee || 0) +
            (payload.total_payment_fee || 0) +
            (payload.total_costs || 0)) -
          (payload.total_discount || 0);
        // --- CREATE ORDER DETAIL ---

        const orderDetail = await this.orderDetailRepository.create(payload, t);
        console.log(
          '🚀 ~ OrderDetailUseCase ~ result ~ orderDetailProducts:',
          orderDetailProducts,
          orderDetail
        );

        await this.orderDetailProductRepository.addProducts(
          orderDetailProducts.map((product) => ({
            ...product,
            order_detail_id: orderDetail.id,
          })),
          t
        );
        await this.orderDetailDiscountRepository.addDiscounts(
          orderDetailDiscounts.map((discount) => ({
            ...discount,
            order_detail_id: orderDetail.id,
          })),
          t
        );
        await this.orderDetailCostRepository.addCosts(
          orderDetailCosts.map((cost) => ({
            ...cost,
            order_detail_id: orderDetail.id,
          })),
          t
        );
        return orderDetail;
      });
      return result;
    } catch (error) {
      console.log('🚀 ~ OrderDetailUseCase ~ create ~ error:', error);
      throw error;
    }
  }
  async update(id: string, data: OrderDetailUpdateDTO): Promise<OrderDetail> {
    return await this.orderDetailRepository.update(id, data);
  }
  async delete(id: string): Promise<boolean> {
    return await this.orderDetailRepository.delete(id);
  }
}
