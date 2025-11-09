# Tarrific Frontend

Tarrific Frontend is a Next.js + TypeScript application that provides an interactive web interface for managing tariffs, HS codes, and trade agreements. It also includes a tariff calculator and a world map visualization of international trade data.

---

## Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- UI: Tailwind CSS + ShadCN UI
- HTTP Client: Axios
- Map Visualization: React Simple Maps
- Icons: Lucide React

---

## Features

- Tariff Calculator — Compute import duties and preferential rates.
- Interactive World Map — Visualize tariff data across countries.
- HS Code Management — Search and manage product classification codes.
- Trade Agreement Support — Reflects preferential tariff rates.
- Admin Tools — Manage countries, tariffs, and codes in one dashboard.

---

## Project Structure

```

tarrific-frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Map/
│   │   └── ui/
│   ├── lib/
│   │   └── api.ts
│   └── styles/
├── .env.local
├── .env.local.example
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md

````

---

## Environment Setup

### 1. Install Dependencies
```bash
npm install
````

### 2. Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Run Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Development Notes

* All API requests go through `src/lib/api.ts`.
* Imports use `@` alias mapped to `./src`.
* ShadCN components are stored in `src/components/ui/`.
* HS code dropdowns and calculators are reactive.

---

## Scripts

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start local development server |
| `npm run build` | Build for production           |
| `npm start`     | Run built version              |
| `npm run lint`  | Lint and fix code              |

---

## Deployment

To build and deploy:

```bash
npm run build
npm start
```

For Docker:

```bash
docker build -t tarrific-frontend .
docker run -p 3000:3000 tarrific-frontend
```
