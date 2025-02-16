import { authReducer } from "@/app/shared/store/reducers/auth";
import { counterReducer } from "@/app/shared/store/reducers/counter";
import { notificationReducer } from "@/app/shared/store/reducers/notification";
import { socketReducer } from "@/app/shared/store/reducers/socket";
import { configureStore } from "@reduxjs/toolkit";
import { customerAuthReducer } from "./main-reducers/auth/auth";
import { customerCartReducer } from "./main-reducers/cart/cart";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    socket: socketReducer,
    notification: notificationReducer,
    auth: authReducer,
  },
});

export const customerStore = configureStore({
  reducer: {
    counter: counterReducer,
    auth: customerAuthReducer,
    cart: customerCartReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export type CustomerRootState = ReturnType<typeof customerStore.getState>;
export type CustomerAppDispatch = typeof customerStore.dispatch;
export type CustomerAppStore = typeof customerStore;
