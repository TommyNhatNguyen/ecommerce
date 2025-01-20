import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  isConnected: boolean;
  orderCreated: string;
}

const initialState: SocketState = {
  isConnected: false,
  orderCreated: "",
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setOrderCreated: (state, action: PayloadAction<string>) => {
      state.orderCreated = action.payload;
    },
  },
});

export const { setIsConnected, setOrderCreated } = socketSlice.actions;
export const socketReducer = socketSlice.reducer;
