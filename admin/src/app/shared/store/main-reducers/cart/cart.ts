import { ModelStatus } from "./../../../../../../../backend/src/share/models/base-model";
import { LOCAL_STORAGE } from "@/app/constants/localStorage";
import { useCustomerAppSelector } from "@/app/shared/hooks/useRedux";
import {
  IAddToCartDTO,
  IAddToCartDTOWithLocal,
} from "@/app/shared/interfaces/cart/cart.dto";
import { CartModel } from "@/app/shared/models/cart/cart.model";
import { cartServices } from "@/app/shared/services/cart/cartService";
import { localStorageService } from "@/app/shared/utils/localStorage";
import { toast } from "@/hooks/use-toast";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CartState {
  cartInfo: CartModel | undefined;
  isLoading: boolean;
  cartError: any;
}

const initialState: CartState = {
  cartInfo: undefined,
  isLoading: false,
  cartError: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartLocal: (
      state,
      { payload }: { payload: IAddToCartDTOWithLocal },
    ) => {
      let cartInfo: CartModel =
        localStorageService.getData(LOCAL_STORAGE.CART_INFO) || undefined;
      if (payload) {
        cartInfo.id = cartInfo.id ? cartInfo.id : payload.cart_id;
        cartInfo.product_quantity = cartInfo.product_quantity
          ? payload.quantity + cartInfo.product_quantity
          : payload.quantity;
        cartInfo.product_count = cartInfo.product_count
          ? !cartInfo.product_sellable?.find((item) => item.id === payload.id)
            ? cartInfo.product_count + 1
            : cartInfo.product_count
          : 1;
        cartInfo.subtotal = cartInfo.subtotal
          ? payload.subtotal + cartInfo.subtotal
          : payload.subtotal;
        cartInfo.total_discount = cartInfo.total_discount
          ? payload.discount_amount + cartInfo.total_discount
          : payload.discount_amount;
        cartInfo.total = cartInfo.total
          ? payload.total + cartInfo.total
          : payload.total;
        cartInfo.status = cartInfo.status || ModelStatus.ACTIVE;
        cartInfo.created_at = cartInfo.created_at
          ? cartInfo.created_at
          : Date.now().toString();
        cartInfo.updated_at = cartInfo.updated_at
          ? cartInfo.updated_at
          : Date.now().toString();
        cartInfo.product_sellable =
          cartInfo?.product_sellable &&
          cartInfo.product_sellable.length > 0 &&
          !!!cartInfo.product_sellable.find((item) => item.id === payload.id)
            ? [...cartInfo.product_sellable, payload.product_sellable]
            : cartInfo.product_sellable || [payload.product_sellable];
        if (cartInfo.product_sellable[0].cart_product_sellable) {
          cartInfo.product_sellable = cartInfo.product_sellable.map((item) => {
            if (item.id === payload.product_sellable.id) {
              return {
                ...item,
                cart_product_sellable: {
                  ...item.cart_product_sellable,
                  cart_id: payload.cart_id,
                  product_sellable_id: item.id,
                  quantity: item.cart_product_sellable?.quantity
                    ? item.cart_product_sellable.quantity +
                      (payload.quantity || 1)
                    : payload.quantity || 1,
                  subtotal: item.cart_product_sellable?.subtotal
                    ? item.cart_product_sellable.subtotal +
                      item.price * (payload.quantity || 1)
                    : item.price * (payload.quantity || 1),
                  discount_amount: item.cart_product_sellable?.discount_amount
                    ? item.cart_product_sellable.discount_amount +
                      item.total_discounts * (payload.quantity || 1)
                    : item.total_discounts * (payload.quantity || 1),
                  total: item.cart_product_sellable?.total
                    ? item.cart_product_sellable.total +
                      item.price_after_discounts * (payload.quantity || 1)
                    : item.price_after_discounts * (payload.quantity || 1),
                  status: ModelStatus.ACTIVE,
                  created_at: Date.now().toString(),
                  updated_at: Date.now().toString(),
                },
              };
            }
            return item;
          });
        } else {
          cartInfo.product_sellable = [
            {
              ...payload.product_sellable,
              cart_product_sellable: {
                cart_id: payload.cart_id,
                product_sellable_id: payload.product_sellable.id,
                quantity: payload.quantity || 1,
                subtotal:
                  payload.product_sellable.price * (payload.quantity || 1),
                discount_amount:
                  payload.product_sellable.total_discounts *
                  (payload.quantity || 1),
                total:
                  payload.product_sellable.price_after_discounts *
                  (payload.quantity || 1),
                status: ModelStatus.ACTIVE,
                created_at: Date.now().toString(),
                updated_at: Date.now().toString(),
              },
            },
          ];
        }
      }
      localStorageService.setData(LOCAL_STORAGE.CART_INFO, cartInfo);
      state.cartInfo = cartInfo;
    },
    getCartByIdLocal: (state, { payload }: { payload: string }) => {
      state.cartInfo = localStorageService.getData(LOCAL_STORAGE.CART_INFO);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCartById.fulfilled, (state, action) => {
      state.cartInfo = action.payload;
      state.isLoading = false;
      state.cartError = null;
    });
    builder.addCase(getCartById.rejected, (state, action) => {
      state.cartInfo = undefined;
      state.isLoading = false;
      state.cartError = action.error;
    });
    builder.addCase(getCartById.pending, (state) => {
      state.cartError = false;
      state.isLoading = true;
    });
  },
});

export const { addToCartLocal, getCartByIdLocal } = cartSlice.actions;
export const customerCartReducer = cartSlice.reducer;

export const getCartById = createAsyncThunk(
  "cart/getCartById",
  async (payload: string, thunkAPI) => {
    if (!payload) {
      thunkAPI.dispatch(getCartByIdLocal(payload));
    } else {
      try {
        localStorageService.deleteData(LOCAL_STORAGE.CART_INFO);
        const response = await cartServices.getCartById(payload, {
          include_products: true,
        });
        if (response) {
          return response;
        }
        return thunkAPI.rejectWithValue("Failed to get customer info");
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (payload: IAddToCartDTOWithLocal, thunkAPI) => {
    if (!payload.cart_id) {
      thunkAPI.dispatch(addToCartLocal(payload));
      thunkAPI.dispatch(getCartByIdLocal(""));
    } else {
      try {
        const finalPayload: IAddToCartDTO = {
          id: payload.id,
          quantity: payload.quantity,
          cart_id: payload.cart_id,
        };
        const response = await cartServices.addToCart(finalPayload);
        if (response) {
          thunkAPI.dispatch(getCartById(finalPayload.cart_id));
          toast({
            title: "Add to cart successfully",
            description: "Check your cart now!",
          });
          return response;
        }
        return thunkAPI.rejectWithValue("Failed to get customer info");
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  },
);
