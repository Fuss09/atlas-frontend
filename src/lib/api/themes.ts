import { apiClient } from "./client";
import type {
  CompanyListItem,
  PaginatedResponse,
  ThemeCreate,
  ThemeListItem,
  ThemeResponse,
  ThemeUpdate,
} from "@/types";

export const themesApi = {
  list: async (params?: {
    category?: string;
    maturity_level?: string;
    include_inactive?: boolean;
  }): Promise<ThemeListItem[]> => {
    const res = await apiClient.get<ThemeListItem[]>("/themes", { params });
    return res.data;
  },

  getById: async (id: string): Promise<ThemeResponse> => {
    const res = await apiClient.get<ThemeResponse>(`/themes/${id}`);
    return res.data;
  },

  getBySlug: async (slug: string): Promise<ThemeResponse> => {
    const res = await apiClient.get<ThemeResponse>(`/themes/by-slug/${slug}`);
    return res.data;
  },

  getCategories: async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>("/themes/categories");
    return res.data;
  },

  getCompanies: async (
    themeId: string,
    page = 1,
    page_size = 20,
  ): Promise<PaginatedResponse<CompanyListItem>> => {
    const res = await apiClient.get<PaginatedResponse<CompanyListItem>>(
      `/themes/${themeId}/companies`,
      { params: { page, page_size } },
    );
    return res.data;
  },

  create: async (data: ThemeCreate): Promise<ThemeResponse> => {
    const res = await apiClient.post<ThemeResponse>("/themes", data);
    return res.data;
  },

  update: async (id: string, data: ThemeUpdate): Promise<ThemeResponse> => {
    const res = await apiClient.patch<ThemeResponse>(`/themes/${id}`, data);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/themes/${id}`);
  },

  addCompany: async (themeId: string, companyId: string): Promise<void> => {
    await apiClient.post(`/themes/${themeId}/companies`, { company_id: companyId });
  },

  removeCompany: async (themeId: string, companyId: string): Promise<void> => {
    await apiClient.delete(`/themes/${themeId}/companies/${companyId}`);
  },

  getForCompany: async (companyId: string): Promise<ThemeListItem[]> => {
    const res = await apiClient.get<ThemeListItem[]>(`/companies/${companyId}/themes`);
    return res.data;
  },
};
