import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CloseCircle, FilterSearch, SearchNormal1 } from "../components/icons";
import { AppShell } from "../components/AppShell";
import { Card } from "../components/Card";
import { InputField } from "../components/InputField";
import { SelectField } from "../components/SelectField";
import { Pagination } from "../components/Pagination";
import { DoctorCard } from "../components/DoctorCard";
import { Button } from "../components/Button";
import { CITIES, DOCTORS_SEED, SPECIALTIES } from "../data/doctors";
import { useDoctorPhotos } from "../hooks/useDoctorPhotos";
import { EmptyState } from "../components/EmptyState";

const PAGE_SIZE = 6;

type AvailabilityFilter = "any" | "today";
type SortKey = "rating" | "price-asc" | "price-desc" | "experience";

export function DoctorsPage() {
  const [params, setParams] = useSearchParams();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [specialty, setSpecialty] = useState(params.get("specialty") ?? "");
  const [city, setCity] = useState(params.get("city") ?? "");
  const [availability, setAvailability] = useState<AvailabilityFilter>(
    (params.get("availability") as AvailabilityFilter) ?? "any",
  );
  const [sort, setSort] = useState<SortKey>((params.get("sort") as SortKey) ?? "rating");
  const [page, setPage] = useState<number>(Number(params.get("page") ?? "1") || 1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = DOCTORS_SEED.filter((d) => {
      if (specialty && d.specialty !== specialty) return false;
      if (city && d.city !== city) return false;
      if (availability === "today" && !d.availableToday) return false;
      if (!q) return true;
      const haystack = `${d.firstName} ${d.lastName} ${d.specialty} ${d.city}`.toLowerCase();
      return haystack.includes(q);
    });

    list.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "experience") return b.experienceYears - a.experienceYears;
      return b.rating - a.rating;
    });
    return list;
  }, [query, specialty, city, availability, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const { photos } = useDoctorPhotos("medkarton-doctors", DOCTORS_SEED.length);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (specialty) next.set("specialty", specialty);
    if (city) next.set("city", city);
    if (availability !== "any") next.set("availability", availability);
    if (sort !== "rating") next.set("sort", sort);
    if (currentPage > 1) next.set("page", String(currentPage));
    setParams(next, { replace: true });
  }, [query, specialty, city, availability, sort, currentPage, setParams]);

  useEffect(() => {
    setPage(1);
  }, [query, specialty, city, availability, sort]);

  function resetFilters() {
    setQuery("");
    setSpecialty("");
    setCity("");
    setAvailability("any");
    setSort("rating");
    setPage(1);
  }

  const activeFilters =
    Number(Boolean(specialty)) +
    Number(Boolean(city)) +
    Number(availability !== "any") +
    Number(Boolean(query));

  return (
    <AppShell>
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">Pronađite lekara</h1>
          <p className="text-sm text-ink-soft">Pretražite i zakažite pregled u par klikova.</p>
        </div>
        <div className="text-sm font-semibold text-ink-soft">
          {filtered.length} {filtered.length === 1 ? "rezultat" : "rezultata"}
        </div>
      </header>

      <Card className="mb-6 !p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <InputField
              placeholder="Pretražite po imenu, specijalnosti ili gradu..."
              leftIcon={<SearchNormal1 size="16" />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <SelectField
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            options={[
              { value: "", label: "Sve specijalnosti" },
              ...SPECIALTIES.map((s) => ({ value: s, label: s })),
            ]}
          />
          <SelectField
            value={city}
            onChange={(e) => setCity(e.target.value)}
            options={[
              { value: "", label: "Svi gradovi" },
              ...CITIES.map((c) => ({ value: c, label: c })),
            ]}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
            <FilterSearch size="14" />
            <span className="font-semibold">Dostupnost:</span>
            <ChipToggle active={availability === "any"} onClick={() => setAvailability("any")}>
              Sve
            </ChipToggle>
            <ChipToggle
              active={availability === "today"}
              onClick={() => setAvailability("today")}
            >
              Dostupan danas
            </ChipToggle>
          </div>
          <div className="flex items-center gap-2">
            <SelectField
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="!w-auto"
              options={[
                { value: "rating", label: "Sortiraj: ocena" },
                { value: "experience", label: "Sortiraj: iskustvo" },
                { value: "price-asc", label: "Sortiraj: cena ↑" },
                { value: "price-desc", label: "Sortiraj: cena ↓" },
              ]}
            />
            {activeFilters > 0 && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<CloseCircle size="14" />}
                onClick={resetFilters}
              >
                Resetuj
              </Button>
            )}
          </div>
        </div>
      </Card>

      {pageItems.length === 0 ? (
        <EmptyState
          icon={<SearchNormal1 size="22" />}
          title="Nema rezultata"
          description="Pokušajte da uklonite filtere ili promenite pretragu."
          action={
            <Button variant="secondary" onClick={resetFilters}>
              Resetuj filtere
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((doc, idx) => {
            const globalIdx = DOCTORS_SEED.findIndex((d) => d.id === doc.id);
            const photoUrl = photos[globalIdx >= 0 ? globalIdx : idx];
            return <DoctorCard key={doc.id} doctor={doc} photoUrl={photoUrl} />;
          })}
        </div>
      )}

      <div className="mt-8">
        <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
      </div>
    </AppShell>
  );
}

function ChipToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full px-3 py-1 text-xs font-semibold transition " +
        (active
          ? "bg-primary-600 text-white"
          : "bg-surface-subtle text-ink-soft hover:bg-surface-alt")
      }
    >
      {children}
    </button>
  );
}
