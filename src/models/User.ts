import type { IUser, UserRole } from "../types";
import { initialsFromName } from "../utils/format";

export class User implements IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;

  constructor(params: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    createdAt?: string;
  }) {
    this.id = params.id;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.email = params.email;
    this.role = params.role;
    this.createdAt = params.createdAt ?? new Date().toISOString();
  }

  fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  initials(): string {
    return initialsFromName(this.firstName, this.lastName);
  }

  roleLabel(): string {
    switch (this.role) {
      case "doctor":
        return "Lekar";
      case "staff":
        return "Medicinski radnik";
      default:
        return "Pacijent";
    }
  }

  static fromJSON(json: Record<string, unknown>): User {
    return new User({
      id: String(json.id),
      firstName: String(json.firstName ?? ""),
      lastName: String(json.lastName ?? ""),
      email: String(json.email ?? ""),
      role: (json.role as UserRole) ?? "patient",
      createdAt: typeof json.createdAt === "string" ? json.createdAt : undefined,
    });
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}
