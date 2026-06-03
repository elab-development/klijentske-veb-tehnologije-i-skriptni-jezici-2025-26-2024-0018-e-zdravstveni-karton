import { useCallback, useEffect, useState } from "react";
import { LocalStore, StorageKeys } from "../utils/storage";
import type { PatientProfile } from "../types";
import { useAuth } from "../context/AuthContext";

const store = new LocalStore<PatientProfile>(StorageKeys.patient);

function buildDefault(user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}): PatientProfile {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: "+381 60 123 45 67",
    dateOfBirth: "1992-04-12",
    jmbg: "1204992710031",
    bloodType: "A+",
    heightCm: 182,
    weightKg: 78,
    allergies: ["Penicilin", "Polen"],
    chronicConditions: [],
    city: "Beograd",
    country: "Srbija",
    cardId: `MK-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 900) + 100,
    )}`,
  };
}

export function usePatientProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PatientProfile | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    const existing = store.load();
    if (existing && existing.email === user.email) {
      setProfile(existing);
    } else {
      const fresh = buildDefault({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
      store.save(fresh);
      setProfile(fresh);
    }
  }, [user]);

  const update = useCallback((patch: Partial<PatientProfile>) => {
    setProfile((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      store.save(next);
      return next;
    });
  }, []);

  return { profile, update };
}
