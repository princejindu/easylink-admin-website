import { EsimProvider } from "@/enums/esim-provider.enum";
import { OrderStatus } from "@/enums/order-status.enum";
import { SortOrder } from "@/enums/sort-order.enum";

export interface Order {
  id: string;
  userId: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  packageId: string;
  packageName?: string;
  provider: EsimProvider;
  status: OrderStatus;
  amountGbp: number;
  iccid?: string;
  activationCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface OrdersListParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  provider?: EsimProvider;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  sortOrder?: SortOrder;
}
