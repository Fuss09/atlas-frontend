import { Skeleton } from "@/components/ui/skeleton";

export default function ThemeDetailLoading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8 space-y-6">
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    </div>
  );
}
