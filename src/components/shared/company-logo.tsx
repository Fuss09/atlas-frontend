import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/format";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: "h-7 w-7 text-caption",
  md: "h-10 w-10 text-body-sm",
  lg: "h-14 w-14 text-h3",
};

export function CompanyLogo({ name, logoUrl, size = "md", className }: CompanyLogoProps) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className={cn("rounded-md object-contain bg-white shrink-0", SIZE_MAP[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-secondary font-semibold text-muted-foreground",
        SIZE_MAP[size],
        className,
      )}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
