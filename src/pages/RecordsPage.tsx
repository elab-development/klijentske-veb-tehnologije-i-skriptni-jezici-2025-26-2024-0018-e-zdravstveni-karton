import { useEffect, useMemo, useState } from "react";
import {
  Add,
  DocumentDownload,
  DocumentText1,
  Eye,
  SearchNormal1,
} from "../components/icons";
import { AppShell } from "../components/AppShell";
import { Card } from "../components/Card";
import { InputField } from "../components/InputField";
import { SelectField } from "../components/SelectField";
import { Pagination } from "../components/Pagination";
import { StatusChip } from "../components/StatusChip";
import { Button } from "../components/Button";
import { SectionHeader } from "../components/SectionHeader";
import { EmptyState } from "../components/EmptyState";
import { RECORDS_SEED, RECORD_TYPES } from "../data/records";
import { LocalStore, StorageKeys } from "../utils/storage";
import { formatDateDot } from "../utils/date";
import { recordStatusTone } from "../utils/status";
import type { MedicalRecord } from "../types";

const PAGE_SIZE = 6;
const recentStore = new LocalStore<string[]>(StorageKeys.recentSearches);

type Period = "all" | "30d" | "90d" | "1y";

export function RecordsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("");
  const [doctor, setDoctor] = useState<string>("");
  const [period, setPeriod] = useState<Period>("all");
  const [page, setPage] = useState(1);
  const [recent, setRecent] = useState<string[]>(() => recentStore.load() ?? []);

  const doctorOptions = useMemo(() => {
    const set = new Set(RECORDS_SEED.map((r) => r.doctorName));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    const now = Date.now();
    const q = query.trim().toLowerCase();
    return RECORDS_SEED.filter((r) => {
      if (type && r.type !== type) return false;
      if (doctor && r.doctorName !== doctor) return false;
      if (period !== "all") {
        const days = period === "30d" ? 30 : period === "90d" ? 90 : 365;
        const ageMs = now - new Date(r.date).getTime();
        if (ageMs > days * 24 * 60 * 60 * 1000) return false;
      }
      if (!q) return true;
      const haystack = `${r.title} ${r.doctorName} ${r.type} ${r.summary ?? ""}`.toLowerCase();
      return haystack.includes(q);
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [query, type, doctor, period]);

  useEffect(() => {
    setPage(1);
  }, [query, type, doctor, period]);

  function commitSearch() {
    const q = query.trim();
    if (!q) return;
    const next = [q, ...recent.filter((s) => s !== q)].slice(0, 6);
    setRecent(next);
    recentStore.save(next);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <AppShell>
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">Moji medicinski nalazi</h1>
          <p className="text-sm text-ink-soft">
            Pregled svih nalaza, pretraga i preuzimanje dokumentacije.
          </p>
        </div>
        <Button leftIcon={<Add size="16" />}>Dodaj nalaz</Button>
      </header>

      <Card className="mb-6 !p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            commitSearch();
          }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="lg:col-span-2">
            <InputField
              placeholder="Pretraži nalaze..."
              leftIcon={<SearchNormal1 size="16" />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={commitSearch}
            />
          </div>
          <SelectField
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: "", label: "Svi tipovi" },
              ...RECORD_TYPES.map((t) => ({ value: t, label: t })),
            ]}
          />
          <SelectField
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            options={[
              { value: "", label: "Svi lekari" },
              ...doctorOptions.map((d) => ({ value: d, label: d })),
            ]}
          />
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-ink-soft">Period:</span>
          {(
            [
              { v: "all", label: "Svi" },
              { v: "30d", label: "30 dana" },
              { v: "90d", label: "90 dana" },
              { v: "1y", label: "12 meseci" },
            ] as Array<{ v: Period; label: string }>
          ).map((opt) => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setPeriod(opt.v)}
              className={
                "rounded-full px-3 py-1 font-semibold transition " +
                (period === opt.v
                  ? "bg-primary-600 text-white"
                  : "bg-surface-subtle text-ink-soft hover:bg-surface-alt")
              }
            >
              {opt.label}
            </button>
          ))}
          {recent.length > 0 && (
            <div className="ml-auto flex items-center gap-1.5 overflow-hidden">
              <span className="text-ink-faint">Nedavno:</span>
              {recent.slice(0, 3).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full bg-surface-subtle px-2.5 py-1 text-[11px] font-semibold text-ink-muted hover:bg-surface-alt"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {pageItems.length === 0 ? (
        <EmptyState
          icon={<DocumentText1 size="22" variant="Bulk" />}
          title="Nema rezultata"
          description="Pokušajte sa drugim filterima ili dodajte novi nalaz."
        />
      ) : (
        <>
          <SectionHeader
            title={`${filtered.length} nalaza`}
            description="Sortirano po datumu, od najnovijeg"
          />
          <ul className="grid gap-3 lg:grid-cols-2">
            {pageItems.map((rec) => (
              <li key={rec.id}>
                <RecordItem record={rec} />
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-8">
        <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
      </div>
    </AppShell>
  );
}

function RecordItem({ record }: { record: MedicalRecord }) {
  return (
    <Card className="flex flex-col gap-3 !p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
          <DocumentText1 size="20" variant="Bulk" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="truncate text-sm font-bold text-ink">{record.title}</h3>
            <StatusChip tone={recordStatusTone(record.status)}>{record.status}</StatusChip>
          </div>
          <p className="text-xs text-ink-soft">
            {record.doctorName} · {formatDateDot(record.date)}
          </p>
        </div>
      </div>
      {record.summary && (
        <p className="line-clamp-2 text-xs text-ink-muted">{record.summary}</p>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" leftIcon={<Eye size="14" />}>
          Otvori
        </Button>
        <Button variant="secondary" size="sm" leftIcon={<DocumentDownload size="14" />}>
          Preuzmi
        </Button>
      </div>
    </Card>
  );
}
