/**
 * Atlas — Core shared types
 * Mirrors backend/app/schemas/company.py PaginatedResponse
 * and backend/app/api/exception_handlers.py error envelope.
 */

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  type?: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> & { errors?: ApiErrorDetail[] };
    timestamp: string;
  };
}

export type UUID = string;
export type ISODateString = string;
