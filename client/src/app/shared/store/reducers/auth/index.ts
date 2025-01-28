import { LoginDTO } from "@/app/shared/interfaces/auth/auth.dto";
import { Permission } from "@/app/shared/models/permission/permission.model";
import { User } from "@/app/shared/models/user/user.model";
import { authServices } from "@/app/shared/services/auth/authServices";
import { userService } from "@/app/shared/services/user/userService";
import { cookiesStorage } from "@/app/shared/utils/localStorage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isLoginLoading: boolean;
  loginError: any;
  isLogin: boolean;
  userInfo: User | null;
  userPermission: Partial<Permission>[] | [];
}

const initialState: AuthState = {
  isLoginLoading: false,
  loginError: null,
  isLogin: false,
  userInfo: null,
  userPermission: [],
};

export const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    logout: (state) => {
      cookiesStorage.deleteToken();
      state.isLoginLoading = false;
      state.loginError = null;
      state.isLogin = false;
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state) => {
      state.isLogin = true;
      state.isLoginLoading = false;
      state.loginError = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLogin = false;
      state.isLoginLoading = false;
      state.loginError = action.payload;
    });
    builder.addCase(login.pending, (state) => {
      state.isLoginLoading = true;
      state.loginError = null;
    });
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      const {role, ...userInfo} = action.payload
      const {permission, ...roleInfo} = role || {}
      state.userPermission = permission || []
      state.userInfo = {...userInfo, role: {...roleInfo}};
    });
    builder.addCase(getUserInfo.rejected, (state, action) => {
      state.userInfo = null;
      state.userPermission = []
    });
    builder.addCase(getUserInfo.pending, (state) => {
      state.userInfo = null;
      state.userPermission = []
    }); 
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const getUserInfo = createAsyncThunk(
  "auth/getUserInfo",
  async (_, thunkAPI) => {
    try {
      const response = await userService.getUserInfo({
        include_permission: true,
        include_role: true,
      });
      if (response) {
        console.log(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue("Failed to get user info");
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    payload: {
      data: LoginDTO;
      callback: { success: () => void; error: (error: any) => void };
    },
    thunkAPI,
  ) => {
    try {
      const response = await authServices.login(payload.data);
      if (response) {
        cookiesStorage.setToken(response.data);
        payload.callback.success();
        thunkAPI.dispatch(getUserInfo());
        return response;
      }
      return thunkAPI.rejectWithValue("Failed to login");
    } catch (error: any) {
      payload.callback.error(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
