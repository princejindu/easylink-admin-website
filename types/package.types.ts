import { EsimProvider } from "@/enums/esim-provider.enum";

export interface EsimPackage {
  id: string;
  name: string;
  dataGb: number;
  validityDays: number;
  priceGbp: number;
  countries: string[];
  provider?: EsimProvider;
  isFeatured: boolean;
}

export interface PackagesListResponse {
  packages: EsimPackage[];
  total: number;
  page: number;
  limit: number;
}
