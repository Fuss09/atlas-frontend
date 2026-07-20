"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useImportCompany } from "@/hooks/use-import-company";

const EXCHANGES = [
  { value: "auto", label: "Auto (US)" },
  { value: "EURONEXT PARIS", label: "Euronext Paris" },
  { value: "EURONEXT AMSTERDAM", label: "Euronext Amsterdam" },
  { value: "EURONEXT BRUSSELS", label: "Euronext Brussels" },
  { value: "LSE", label: "London (LSE)" },
  { value: "XETRA", label: "Xetra (Frankfurt)" },
];

/**
 * Import d'une entreprise réelle par ticker (Sprint 12).
 * À la création, redirige vers la fiche fraîchement importée — le
 * « moment magique » : une vraie entreprise entre dans Atlas en 5 secondes.
 */
export function AddCompanyDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [ticker, setTicker] = React.useState("");
  const [exchange, setExchange] = React.useState("auto");
  const [error, setError] = React.useState<string | null>(null);

  const importCompany = useImportCompany();

  const handleSubmit = () => {
    const trimmed = ticker.trim().toUpperCase();
    if (!trimmed) return;
    setError(null);
    importCompany.mutate(
      { ticker: trimmed, exchange: exchange === "auto" ? null : exchange },
      {
        onSuccess: (company) => {
          setOpen(false);
          setTicker("");
          router.push(`/companies/${company.slug}`);
        },
        onError: (err: unknown) => {
          const status = (err as { response?: { status?: number } })?.response?.status;
          setError(
            status === 404
              ? `Ticker "${trimmed}" not found. Check the symbol and the exchange.`
              : "Import failed. Is the backend running?"
          );
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); setError(null); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Add company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a real company</DialogTitle>
          <DialogDescription>
            Import by ticker — name, sector and profile are fetched automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ticker">Ticker</Label>
            <Input
              id="ticker"
              placeholder="e.g. ABVX, NVDA"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label>Exchange</Label>
            <Select value={exchange} onValueChange={setExchange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXCHANGES.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-body-sm text-destructive">{error}</p>}
          <Button
            onClick={handleSubmit}
            disabled={!ticker.trim() || importCompany.isPending}
            className="w-full gap-2"
          >
            {importCompany.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {importCompany.isPending ? "Importing…" : "Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
