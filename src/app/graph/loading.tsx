import { Skeleton } from "@/components/ui/skeleton";

export default function GraphLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24 space-y-8">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2 text-center">
          <Skeleton className="h-9 w-64 mx-auto" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
      </div>
      <Skeleton className="h-11 w-full max-w-md mx-auto" />
    </div>
  );
}
