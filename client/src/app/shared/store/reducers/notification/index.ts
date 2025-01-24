import { NotificationConditionDTO } from "@/app/shared/interfaces/notification/notification.dto";
import { NotificationModel } from "@/app/shared/models/notification/notification.model";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { notificationServices } from "@/app/shared/services/notification/notificationService";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface NotificationState {
  notificationList: ListResponseModel<NotificationModel> & { count_unread: number };
  isLoading: boolean;
  error: any;
  isReadSuccess: boolean;
  isDeleteSuccess: boolean;
}

const initialState: NotificationState = {
  notificationList: {
    count_unread: 0,
    data: [],
    meta: {
      limit: 0,
      total_count: 0,
      current_page: 0,
      total_page: 0,
    },
  },
  isLoading: false,
  error: null,
  isReadSuccess: false,
  isDeleteSuccess: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNotificationThunk.fulfilled, (state, action) => {
      state.notificationList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getNotificationThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getNotificationThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
    builder.addCase(readNotificationThunk.fulfilled, (state, action) => {
      state.isReadSuccess = true;
      state.isLoading = false;
    });
    builder.addCase(readNotificationThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(readNotificationThunk.rejected, (state, action) => {
      state.isReadSuccess = false;
      state.isLoading = false;
      state.error = action.error;
    });
    builder.addCase(deleteNotificationThunk.fulfilled, (state, action) => {
      state.isDeleteSuccess = true;
      state.isLoading = false;
    });
    builder.addCase(deleteNotificationThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteNotificationThunk.rejected, (state, action) => {
      state.isDeleteSuccess = false;
      state.isLoading = false;
      state.error = action.error;
    });
  },
});

export const {} = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;

export const getNotificationThunk = createAsyncThunk(
  "notification/getNotification",
  async (payload: NotificationConditionDTO, thunkAPI) => {
    try {
      const response = await notificationServices.getList(payload);
      if (response) {
        return response;
      }
      return thunkAPI.rejectWithValue("Failed to get notification");
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const readNotificationThunk = createAsyncThunk(
  "notification/readNotification",
  async (payload: string, thunkAPI) => {
    try {
      const response = await notificationServices.readNotification(payload);
      if (response) {
        return response;
      }
      return thunkAPI.rejectWithValue("Failed to read notification");
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    } finally {
      thunkAPI.dispatch(getNotificationThunk({}));
    }
  },
);

export const deleteNotificationThunk = createAsyncThunk(
  "notification/deleteNotification",
  async (payload: string, thunkAPI) => {
    try {
      const response = await notificationServices.deleteNotification(payload);
      if (response) {
        return response;
      }
      return thunkAPI.rejectWithValue("Failed to delete notification");
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    } finally {
      thunkAPI.dispatch(getNotificationThunk({}));
    }
  },
);

