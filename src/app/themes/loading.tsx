import { Skeleton } from "@/components/ui/skeleton";

export default function ThemesLoading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8 space-y-6">
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}
