import { counterReducer } from "@/app/shared/store/reducers/counter";
import { socketReducer } from "@/app/shared/store/reducers/socket";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    socket: socketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
