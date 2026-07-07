import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="space-y-3 w-full max-w-md px-4">
        <Skeleton className="h-6 w-32 mx-auto" />
        <Skeleton className="h-3 w-48 mx-auto" />
      </div>
    </div>
  );
}
