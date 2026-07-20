"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyImportApi, type CompanyImportPayload } from "@/lib/api/company-import";

export function useImportCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CompanyImportPayload) => companyImportApi.importByTicker(payload),
    onSuccess: async () => {
      // La liste, les facettes (secteurs/pays) et le total changent
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
