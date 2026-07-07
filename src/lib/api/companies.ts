import { apiClient } from "./client";
import type {
  CompanyCreate,
  CompanyListItem,
  CompanyResponse,
  CompanySearchParams,
  CompanyUpdate,
  PaginatedResponse,
} from "@/types";

export const companiesApi = {
  list: async (params: CompanySearchParams): Promise<PaginatedResponse<CompanyListItem>> => {
    const res = await apiClient.get<PaginatedResponse<CompanyListItem>>("/companies", { params });
    return res.data;
  },

  getById: async (id: string): Promise<CompanyResponse> => {
    const res = await apiClient.get<CompanyResponse>(`/companies/${id}`);
    return res.data;
  },

  getBySlug: async (slug: string): Promise<CompanyResponse> => {
    const res = await apiClient.get<CompanyResponse>(`/companies/by-slug/${slug}`);
    return res.data;
  },

  getByTicker: async (ticker: string): Promise<CompanyResponse> => {
    const res = await apiClient.get<CompanyResponse>(`/companies/by-ticker/${ticker}`);
    return res.data;
  },

  getFeatured: async (limit = 10): Promise<CompanyListItem[]> => {
    const res = await apiClient.get<CompanyListItem[]>("/companies/featured", { params: { limit } });
    return res.data;
  },

  getSectors: async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>("/companies/sectors");
    return res.data;
  },

  getCountries: async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>("/companies/countries");
    return res.data;
  },

  create: async (data: CompanyCreate): Promise<CompanyResponse> => {
    const res = await apiClient.post<CompanyResponse>("/companies", data);
    return res.data;
  },

  update: async (id: string, data: CompanyUpdate): Promise<CompanyResponse> => {
    const res = await apiClient.patch<CompanyResponse>(`/companies/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/companies/${id}`);
  },

  setFeatured: async (id: string, featured: boolean): Promise<CompanyResponse> => {
    const res = await apiClient.post<CompanyResponse>(`/companies/${id}/feature`, null, {
      params: { featured },
    });
    return res.data;
  },
};
