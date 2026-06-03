import { useEffect, useState } from "react";
import { fetchDoctorPhotos } from "../services/api";

export function useDoctorPhotos(seed: string, count: number) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchDoctorPhotos(seed, count)
      .then((data) => {
        if (active) setPhotos(data);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Greška.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [seed, count]);

  return { photos, loading, error };
}
