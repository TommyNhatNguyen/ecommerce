import { IMessage } from "@/app/shared/models/chat/chat.model";
import { InventoryModel } from "@/app/shared/models/inventories/inventories.model";
import { OrderModel } from "@/app/shared/models/orders/orders.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  isConnected: boolean;
  orderCreated: OrderModel;
  inventoryLowInventory: InventoryModel;
  chatMessage: IMessage[];
}

const initialState: SocketState = {
  isConnected: false,
  orderCreated: {} as OrderModel,
  inventoryLowInventory: {} as InventoryModel,
  chatMessage: [] as IMessage[],
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
    setInventoryLowInventory: (state, action: PayloadAction<string>) => {
      console.log("🚀 ~ setInventoryLowInventory ~ action:", action.payload);
      let inventory;
      try {
        inventory = JSON.parse(action.payload);
      } catch {
        inventory = action.payload;
      }
      state.inventoryLowInventory = inventory;
    },
    setChatMessage: (state, action: PayloadAction<IMessage[]>) => {
      state.chatMessage = action.payload;
    },
  },
});

export const {
  setIsConnected,
  setOrderCreated,
  setInventoryLowInventory,
  setChatMessage,
} = socketSlice.actions;
export const socketReducer = socketSlice.reducer;
