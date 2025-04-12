import { CustomerLoginDTO } from "@/app/shared/interfaces/customers/customers.dto";
import { CustomerModel } from "@/app/shared/models/customers/customers.model";
import { customerService } from "@/app/shared/services/customers/customerService";
import { cookiesStorage } from "@/app/shared/utils/localStorage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartById, getCartByIdLocal } from "../cart/cart";

interface AuthState {
  isLoginLoading: boolean;
  loginError: any;
  customerInfo: CustomerModel | null;
}

const initialState: AuthState = {
  isLoginLoading: false,
  loginError: null,
  customerInfo: null,
};

export const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    logout: (state) => {
      cookiesStorage.deleteToken();
      state.isLoginLoading = false;
      state.loginError = null;
      state.customerInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoginLoading = false;
      state.loginError = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoginLoading = false;
      state.loginError = action.payload;
    });
    builder.addCase(login.pending, (state) => {
      state.isLoginLoading = true;
      state.loginError = null;
    });
    builder.addCase(getCustomerInfo.fulfilled, (state, action) => {
      state.customerInfo = action.payload;
    });
    builder.addCase(getCustomerInfo.rejected, (state, action) => {
      state.customerInfo = null;
    });
  },
});

export const { logout } = authSlice.actions;
export const customerAuthReducer = authSlice.reducer;

export const getCustomerInfo = createAsyncThunk(
  "auth/getCustomerInfo",
  async (_, thunkAPI) => {
    try {
      const response = await customerService.getCustomerInfo({});
      if (response) {
        thunkAPI.dispatch(getCartById(response.data.cart_id));
        return response.data;
      }
      thunkAPI.dispatch(getCartByIdLocal(""));
      return thunkAPI.rejectWithValue("Failed to get customer info");
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    payload: {
      data: CustomerLoginDTO;
      callback: { success: () => void; error: (error: any) => void };
    },
    thunkAPI,
  ) => {
    try {
      const response = await customerService.login(payload.data);
      if (response) {
        cookiesStorage.setToken(response.data);
        payload.callback.success();
        thunkAPI.dispatch(getCustomerInfo());
        return response;
      } else {
        return thunkAPI.rejectWithValue("Failed to login");
      }
    } catch (error: any) {
      payload.callback.error(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
