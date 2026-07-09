"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";

export function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  const errorMessage = login.error instanceof ApiError ? login.error.message : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      {errorMessage && (
        <p className="text-body-sm text-danger" role="alert">
          {errorMessage}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Sign in
      </Button>

      <p className="text-center text-caption text-muted-foreground">
        Most of Atlas — Dashboard, Companies, Opportunities, Themes, Events, and the Graph — is
        browsable without an account. Sign in only if you need Settings or admin actions.
      </p>
    </form>
  );
}
