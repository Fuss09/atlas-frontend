import { Skeleton } from "@/components/ui/skeleton";

/**
 * Next.js automatically wraps the async CompanyPageContent Server
 * Component in a Suspense boundary using this file as the fallback —
 * shown while the server fetches company/opportunity/events/themes/
 * sources on navigation to /companies/[slug].
 */
export default function CompanyDetailLoading() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-14 rounded-md shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-52" />
          </div>
        </div>
        <Skeleton className="h-24 w-24 rounded-full shrink-0" />
      </div>

      <Skeleton className="h-12 w-full" />

      <Skeleton className="h-10 w-80" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
