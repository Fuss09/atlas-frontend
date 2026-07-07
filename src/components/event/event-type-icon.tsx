import {
  Newspaper,
  FileText,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  FlaskConical,
  Rocket,
  Handshake,
  Building2,
  DollarSign,
  FileCheck,
  Github,
  Sparkles,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import type { EventType } from "@/types";

export const EVENT_TYPE_ICONS: Record<EventType, LucideIcon> = {
  news: Newspaper,
  earnings: Landmark,
  sec_filing: FileText,
  insider_buy: TrendingUp,
  insider_sell: TrendingDown,
  fda_approval: CheckCircle2,
  fda_rejection: XCircle,
  clinical_trial: FlaskConical,
  product_launch: Rocket,
  partnership: Handshake,
  acquisition: Building2,
  funding: DollarSign,
  patent: FileCheck,
  github_activity: Github,
  yc_discovery: Sparkles,
  crunchbase_funding: DollarSign,
};

export function EventTypeIcon({ type, className }: { type: EventType; className?: string }) {
  const Icon = EVENT_TYPE_ICONS[type] ?? Newspaper;
  return <Icon className={className} />;
}
