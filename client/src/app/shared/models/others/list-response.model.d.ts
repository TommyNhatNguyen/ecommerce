import { PagingModel } from "./paging.model";

export type ListResponseModel<T> = {
  data: T[];
  meta: PagingModel;
};
