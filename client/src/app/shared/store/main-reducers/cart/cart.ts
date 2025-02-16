import { useCustomerAppSelector } from "@/app/shared/hooks/useRedux";
import { IAddToCartDTO } from "@/app/shared/interfaces/cart/cart.dto";
import { CartModel } from "@/app/shared/models/cart/cart.model";
import { cartServices } from "@/app/shared/services/cart/cartService";
import { toast } from "@/hooks/use-toast";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CartState {
  cartInfo: CartModel | null;
  isLoading: boolean;
  cartError: any;
}

const initialState: CartState = {
  cartInfo: null,
  isLoading: false,
  cartError: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCartById.fulfilled, (state, action) => {
      state.cartInfo = action.payload;
      state.isLoading = false;
      state.cartError = null;
    });
    builder.addCase(getCartById.rejected, (state, action) => {
      state.cartInfo = null;
      state.isLoading = false;
      state.cartError = action.error;
    });
    builder.addCase(getCartById.pending, (state) => {
      state.cartError = false;
      state.isLoading = true;
    });
  },
});

export const {} = cartSlice.actions;
export const customerCartReducer = cartSlice.reducer;

export const getCartById = createAsyncThunk(
  "cart/getCartById",
  async (payload: string, thunkAPI) => {
    try {
      const response = await cartServices.getCartById(payload, {
        include_products: true
      });
      console.log("🚀 ~ response:", response);
      if (response) {
        return response;
      }
      return thunkAPI.rejectWithValue("Failed to get customer info");
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (payload: IAddToCartDTO, thunkAPI) => {
    try {
      const response = await cartServices.addToCart(payload);
      if (response) {
        thunkAPI.dispatch(getCartById(payload.cart_id));
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
  },
);
