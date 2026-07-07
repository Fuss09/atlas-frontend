import { formatDate, formatMarketCap, formatNumber } from "@/lib/format";
import type { CompanyResponse } from "@/types";

interface StatItem {
  label: string;
  value: string;
}

export function StatBar({ company }: { company: CompanyResponse }) {
  const items: StatItem[] = [];

  if (company.market_cap_usd !== null) {
    items.push({ label: "Market Cap", value: formatMarketCap(company.market_cap_usd) });
  }
  if (company.employees !== null) {
    items.push({ label: "Employees", value: formatNumber(company.employees) });
  }
  if (company.founded_year !== null) {
    items.push({ label: "Founded", value: String(company.founded_year) });
  }
  if (company.ipo_date) {
    items.push({ label: "IPO Date", value: formatDate(company.ipo_date) });
  }
  if (company.exchange) {
    items.push({ label: "Exchange", value: company.exchange });
  }

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-border-subtle bg-surface px-4 py-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-baseline gap-1.5">
          <span className="text-caption text-muted-foreground">{item.label}</span>
          <span className="text-body-sm font-mono font-medium text-foreground tabular-nums">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
