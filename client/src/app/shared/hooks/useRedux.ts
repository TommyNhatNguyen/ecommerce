import { useDispatch, useSelector, useStore } from "react-redux";
import { AppDispatch, AppStore, CustomerAppStore, RootState } from "@/app/shared/store";
import { CustomerAppDispatch, CustomerRootState } from "@/app/shared/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const useCustomerAppDispatch = useDispatch.withTypes<CustomerAppDispatch>();
export const useCustomerAppSelector = useSelector.withTypes<CustomerRootState>();
export const useCustomerAppStore = useStore.withTypes<CustomerAppStore>();
