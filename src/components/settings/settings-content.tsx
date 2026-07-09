"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, UserX } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export function SettingsContent() {
  const { theme, setTheme } = useTheme();
  const { data: user, isLoading } = useCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 mb-1">Settings</h1>
        <p className="text-body-sm text-muted-foreground">Manage your Atlas preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Atlas defaults to dark mode. Light mode is available if preferred.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
              <Label htmlFor="theme-switch" className="cursor-pointer">
                Dark mode
              </Label>
            </div>
            <Switch
              id="theme-switch"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-6 pt-0">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : user ? (
            <div className="space-y-3 text-body-sm px-6 pb-6">
              <Row label="Name" value={user.name} />
              <Separator />
              <Row label="Email" value={user.email} />
              <Separator />
              <Row label="Role" value={user.role} className="capitalize" />
            </div>
          ) : (
            <EmptyState
              icon={UserX}
              title="Not signed in"
              description="Sign in to see your account details and personalize Atlas."
              action={
                <Button asChild size="sm" className="mt-1">
                  <Link href="/login">Sign in</Link>
                </Button>
              }
              className="border-none py-10"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={className}>{value}</span>
    </div>
  );
}
