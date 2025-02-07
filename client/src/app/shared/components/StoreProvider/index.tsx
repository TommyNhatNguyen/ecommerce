"use client";
import {
  AppStore,
  CustomerAppStore,
  customerStore,
  store,
} from "@/app/shared/store";
import { useRef } from "react";
import { Provider } from "react-redux";

export function CustomerStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<CustomerAppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = customerStore;
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = store;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
