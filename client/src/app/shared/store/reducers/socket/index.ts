import { OrderModel } from "@/app/shared/models/orders/orders.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  isConnected: boolean;
  orderCreated: OrderModel;
}

const initialState: SocketState = {
  isConnected: false,
  orderCreated: {} as OrderModel,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setOrderCreated: (state, action: PayloadAction<string>) => {
      console.log("🚀 ~ setOrderCreated ~ action:", action.payload);
      let order;
      try {
        order = JSON.parse(action.payload);
      } catch {
        order = action.payload;
      }
      state.orderCreated = order;
    },
  },
});

export const { setIsConnected, setOrderCreated } = socketSlice.actions;
export const socketReducer = socketSlice.reducer;
