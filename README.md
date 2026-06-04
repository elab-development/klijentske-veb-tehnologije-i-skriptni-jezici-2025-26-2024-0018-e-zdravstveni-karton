# MedKarton

Klijentska veb aplikacija za upravljanje elektronskim zdravstvenim kartonima pacijenata. Omogućava sigurno čuvanje medicinskih informacija, brz pristup nalazima i zakazivanje pregleda kod željenog lekara.

Aplikacija je razvijena u **React 19 + TypeScript** korišćenjem **Vite** build alata, **Tailwind CSS** za stilizovanje i **React Router** za navigaciju. Stanje korisnika i termina se čuva u `localStorage`, dok se podaci o praznicima (za blokiranje termina) i fotografije lekara povlače sa eksternih API-ja.

## Sadržaj

- [Pokretanje projekta](#pokretanje-projekta)
- [Tehnologije i biblioteke](#tehnologije-i-biblioteke)
- [Funkcionalnosti](#funkcionalnosti)
- [Stranice aplikacije](#stranice-aplikacije)
- [Reusable komponente](#reusable-komponente)
- [Klase i interfejsi](#klase-i-interfejsi)
- [Struktura projekta](#struktura-projekta)
- [API integracije](#api-integracije)

## Pokretanje projekta

Potrebni alati: Node.js 18+ i npm.

```bash
# 1. Kloniraj repozitorijum
git clone <github-repo-url> medkarton
cd medkarton

# 2. Instaliraj zavisnosti
npm install

# 3. Pokreni razvojni server
npm run dev
# otvori http://localhost:5173

# 4. Produkcioni build (opciono)
npm run build
npm run preview
```

## Tehnologije i biblioteke

| Tehnologija | Namena |
|-------------|--------|
| **React 19** | UI biblioteka, funkcionalne komponente, hooks (useState, useEffect, useMemo, useCallback, useContext, useNavigate, useLocation, useSearchParams, useParams, useRef). |
| **TypeScript** | Statička provera tipova, interfejsi za domenske modele. |
| **Vite** | Brzi dev server i bundler. |
| **React Router DOM v7** | Klijentsko rutiranje, dinamički segmenti, zaštićene rute, query parametri. |
| **Tailwind CSS** | Utility first stilizovanje sa proširenim design tokenima. |
| **Iconsax React** | Profesionalna ikonica biblioteka, koristi se umesto emoji simbola. |
| **PostCSS / Autoprefixer** | CSS post processing. |
| **Inter (Google Fonts)** | Tipografija. |

## Funkcionalnosti

Aplikacija ispunjava sve minimalne i napredne zahteve definisane projektnim zadatkom:

**Minimalni zahtevi:**
1. **Više od 5 stranica**: Prijava, Registracija, Početna, Profil, Lekari, Profil lekara, Zakazivanje, Termini, Nalazi.
2. **Više od 3 reusable komponente**: `Button`, `InputField`, `SelectField`, `Avatar`, `StatusChip`, `Card`, `Pagination`, `DoctorCard`, `SectionHeader`, `EmptyState`, `Logo`, `AppShell`, `AuthLayout`, `ProtectedRoute`.
3. **Stilizovanje**: Tailwind CSS sa custom design tokenima (primary paleta, ink/surface boje, tipografija).
4. **Više od 7 funkcionalnosti u TypeScript-u**: autentifikacija, registracija, izmena profila, pretraga lekara, filteri (specijalnost, grad, dostupnost), sortiranje, paginacija, zakazivanje, otkazivanje termina, pretraga nalaza, perzistencija u localStorage.
5. **React hooks**: `useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`, `useRef`, `useNavigate`, `useLocation`, `useParams`, `useSearchParams`, forwardRef.
6. **2+ klase**: `User`, `AppointmentScheduler`, `LocalStore`, `SessionStore`.
7. **2+ interfejsa**: `IUser`, `IStorable<T>`, `IScheduler`, `PatientProfile`, `Doctor`, `Appointment`, `MedicalRecord`.
8. **React Router DOM**: `BrowserRouter`, `Route`, `Routes`, `Navigate`, `Link`, `NavLink`, dinamički parametri (`/lekari/:id`, `/zakazivanje/:doctorId`).
9. **Strukturirani projekat**: odvojeni folderi za `pages`, `components`, `models`, `types`, `services`, `context`, `hooks`, `utils`, `data`.
10. **Paginacija**: implementirana na stranicama `Lekari` i `Nalazi`.
11. **Filteri**: pretraga po imenu/tekstu, dropdown filteri (specijalnost, grad, tip nalaza, lekar), period, dostupnost, sortiranje.

**Napredni zahtevi:**
- **Responzivnost**: sve stranice su prilagođene mobilnim, tablet i desktop uređajima (mobilna donja navigacija, desktop sidebar).
- **2 API-ja**:
  - `https://date.nager.at/api/v3/PublicHolidays/{year}/RS` za listu državnih praznika (blokira ne-radne dane u zakazivanju).
  - `https://randomuser.me/api/` za fotografije lekara.
- **Local Storage**: koristi se za auth sesiju, profil pacijenta, listu termina, nedavne pretrage, i keš API odgovora.

## Stranice aplikacije

| Ruta | Komponenta | Opis |
|------|------------|------|
| `/prijava` | `LoginPage` | Prijava sa email/lozinka validacijom. |
| `/registracija` | `RegisterPage` | Kreiranje naloga (pacijent, lekar, medicinski radnik). |
| `/` | `HomePage` | Dashboard sa statistikama, predstojećim terminima, brzim akcijama. |
| `/profil` | `ProfilePage` | Lični i zdravstveni podaci pacijenta sa edit modom. |
| `/lekari` | `DoctorsPage` | Lista lekara sa pretragom, filterima, sortiranjem i paginacijom. |
| `/lekari/:id` | `DoctorProfilePage` | Detalji lekara, dostupni termini, radno vreme. |
| `/zakazivanje/:doctorId` | `BookingPage` | Višestepena forma za zakazivanje (datum, vreme, tip, potvrda). |
| `/zakazivanja` | `AppointmentsPage` | Pregled svih termina (predstojeći, obavljeni, otkazani). |
| `/nalazi` | `RecordsPage` | Lista medicinskih nalaza sa pretragom, filterima i paginacijom. |

## Reusable komponente

`src/components/` sadrži deljive UI komponente:

- **`Button`**: varijante (`primary`, `secondary`, `ghost`, `danger`), veličine, loading state, ikone.
- **`InputField`**: wrapper oko `<input>` sa labelom, hint/error porukom, levom ikonom i desnim slotom.
- **`SelectField`**: stilizovani `<select>` sa opcijama.
- **`Avatar`**: inicijali ili slika, veličine `xs` do `xl`, tonalni varijanti.
- **`StatusChip`**: semantički obojeni labeli (`success`, `warning`, `danger`, `primary`, `neutral`).
- **`Card`**: osnovni kontejner sa border, padding, shadow.
- **`Pagination`**: page numbers, prev/next strelice, ellipsis za velike skupove.
- **`SectionHeader`**: naslov sekcije sa opcionalnom akcijom.
- **`DoctorCard`**: kartica lekara.
- **`AppShell`**: desktop sidebar + mobilna donja navigacija + top bar.
- **`AuthLayout`**: split layout sa hero stranom za auth stranice.

## Klase i interfejsi

**Klase** (`src/models/`, `src/utils/storage.ts`):

- `User`: domenski model korisnika sa metodama `fullName()`, `initials()`, `roleLabel()`, statičkim `fromJSON()` / `toJSON()`.
- `AppointmentScheduler`: upravlja terminima, čuva ih u localStorage, ima metode `list()`, `upcoming()`, `past()`, `add()`, `cancel()`, `isSlotTaken()` i statičke `priceFor()`, `durationFor()`.
- `LocalStore<T>` / `SessionStore<T>`: generičke klase za persistenciju.

**Interfejsi** (`src/types/index.ts`):

- `IUser`: ugovor za korisnika.
- `IStorable<T>`: ugovor za skladišta.
- `IScheduler`: ugovor za zakazivanje (`models/AppointmentScheduler.ts`).
- `PatientProfile`, `Doctor`, `Appointment`, `MedicalRecord`, `PublicHoliday`, `RandomApiUser`: domenski modeli.

## Struktura projekta

```
src/
├── components/        Reusable UI komponente
├── context/           React Context provideri (Auth, Appointments)
├── data/              Seed podaci (lekari, nalazi, termini)
├── hooks/             Custom hooks (useDoctorPhotos, useHolidays, usePatientProfile)
├── models/            Domenske klase (User, AppointmentScheduler)
├── pages/             Stranice aplikacije
├── services/          Auth servis, API klijenti
├── types/             TypeScript interfejsi
├── utils/             Pomoćne funkcije (storage, date, format)
├── App.tsx            Root komponent sa rutama
└── main.tsx           Vite entry point
```

## API integracije

1. **Public Holidays API (Nager.Date)**: `GET https://date.nager.at/api/v3/PublicHolidays/{year}/RS`. Praznici se prikazuju kao nedostupni dani prilikom zakazivanja. Odgovori se keširaju u localStorage 24h.
2. **Random User Generator**: `GET https://randomuser.me/api/?results=N&seed=medkarton-doctors`. Fotografije se koriste za avatare lekara. Keširano 7 dana.

---

**Tema:** Veb aplikacija za e-zdravstveni karton  
**Tehnologija:** React + TypeScript + Vite + Tailwind CSS  
**Autor:** Vukan Vučković, 2024/0018  
**Predmet:** Razvoj klijentske veb aplikacije
