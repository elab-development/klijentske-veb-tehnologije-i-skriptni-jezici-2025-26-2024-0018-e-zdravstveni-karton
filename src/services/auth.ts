import { User } from "../models/User";
import { LocalStore, StorageKeys } from "../utils/storage";
import type { UserRole } from "../types";

interface StoredAuth {
  user: ReturnType<User["toJSON"]>;
  token: string;
}

const store = new LocalStore<StoredAuth>(StorageKeys.auth);

export async function login(email: string, password: string): Promise<User> {
  await new Promise((r) => setTimeout(r, 600));

  if (!email || !password) {
    throw new Error("Unesite email i lozinku.");
  }
  if (password.length < 6) {
    throw new Error("Lozinka mora imati najmanje 6 karaktera.");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Neispravan format email adrese.");
  }

  const existing = store.load();
  let user: User;
  if (existing && existing.user.email === email) {
    user = User.fromJSON(existing.user as Record<string, unknown>);
  } else {
    const guessedFirst = email.split("@")[0].split(".")[0] ?? "Korisnik";
    const guessedLast = email.split("@")[0].split(".")[1] ?? "MedKarton";
    user = new User({
      id: `u-${Date.now()}`,
      firstName: cap(guessedFirst),
      lastName: cap(guessedLast),
      email,
      role: "patient",
    });
  }

  store.save({ user: user.toJSON(), token: cryptoRandom() });
  return user;
}

export async function register(params: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<User> {
  await new Promise((r) => setTimeout(r, 700));

  if (!params.firstName || !params.lastName) {
    throw new Error("Ime i prezime su obavezni.");
  }
  if (!/^\S+@\S+\.\S+$/.test(params.email)) {
    throw new Error("Neispravan format email adrese.");
  }
  if (params.password.length < 6) {
    throw new Error("Lozinka mora imati najmanje 6 karaktera.");
  }

  const user = new User({
    id: `u-${Date.now()}`,
    firstName: params.firstName.trim(),
    lastName: params.lastName.trim(),
    email: params.email.trim().toLowerCase(),
    role: params.role,
  });

  store.save({ user: user.toJSON(), token: cryptoRandom() });
  return user;
}

export function logout(): void {
  store.clear();
}

export function currentUser(): User | null {
  const data = store.load();
  if (!data) return null;
  return User.fromJSON(data.user as Record<string, unknown>);
}

function cap(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function cryptoRandom(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
