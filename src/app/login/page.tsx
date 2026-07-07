import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-primary text-primary-foreground font-bold">
            A
          </div>
          <div>
            <h1 className="text-h1">Atlas</h1>
            <p className="text-body-sm text-muted-foreground mt-1">Market Intelligence</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
