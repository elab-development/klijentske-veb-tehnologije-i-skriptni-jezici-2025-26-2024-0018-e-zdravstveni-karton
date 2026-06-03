import type { PublicHoliday, RandomApiUser } from "../types";

const HOLIDAY_CACHE_KEY = "medkarton:cache:holidays";
const PHOTOS_CACHE_KEY = "medkarton:cache:photos";

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (parsed.expiresAt < Date.now()) return null;
    return parsed.value;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, value: T, ttlMs: number): void {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ expiresAt: Date.now() + ttlMs, value }),
    );
  } catch {
    /* ignore quota errors */
  }
}

export async function fetchPublicHolidays(
  year: number,
  countryCode = "RS",
): Promise<PublicHoliday[]> {
  const cacheKey = `${HOLIDAY_CACHE_KEY}:${countryCode}:${year}`;
  const cached = readCache<PublicHoliday[]>(cacheKey);
  if (cached) return cached;

  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Greška pri preuzimanju praznika (${res.status})`);
  }
  const data = (await res.json()) as PublicHoliday[];
  writeCache(cacheKey, data, 24 * 60 * 60 * 1000);
  return data;
}

export async function fetchDoctorPhotos(seed: string, count: number): Promise<string[]> {
  const cacheKey = `${PHOTOS_CACHE_KEY}:${seed}:${count}`;
  const cached = readCache<string[]>(cacheKey);
  if (cached) return cached;

  const url = `https://randomuser.me/api/?results=${count}&seed=${encodeURIComponent(
    seed,
  )}&inc=picture&nat=us,gb,de,fr`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Greška pri preuzimanju fotografija (${res.status})`);
  }
  const data = (await res.json()) as { results: RandomApiUser[] };
  const photos = data.results.map((u) => u.picture.large);
  writeCache(cacheKey, photos, 7 * 24 * 60 * 60 * 1000);
  return photos;
}
