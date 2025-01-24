import { counterReducer } from "@/app/shared/store/reducers/counter";
import { notificationReducer } from "@/app/shared/store/reducers/notification";
import { socketReducer } from "@/app/shared/store/reducers/socket";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    socket: socketReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
