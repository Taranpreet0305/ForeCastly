# Forecastly Weather

Forecastly is a weather dashboard built with React, TypeScript, and Vite. It shows current conditions, hourly and multi-day forecasts, air quality, UV index, weather alerts, and a map view for any searchable city, with automatic geolocation on first load.

## Features

- Current weather with temperature, feels-like, humidity, pressure, visibility, and wind details
- Search with city suggestions powered by the OpenWeather geocoding API
- Automatic geolocation lookup when the browser allows location access
- Hourly forecast and 5-day outlook
- Air quality and UV index cards
- Weather alerts when available from the API
- Interactive weather map using Leaflet
- Favorite cities saved in `localStorage`
- Theme toggle and unit switching for temperature and wind speed

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- shadcn/ui and Radix UI
- TanStack Query
- Leaflet and React Leaflet
- Vitest and Playwright

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- `npm` or `bun`

### Install

```bash
npm install
```

or

```bash
bun install
```

### Run locally

```bash
npm run dev
```

Open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

## Available Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build
- `npm run build:dev` builds using Vite's development mode
- `npm run preview` serves the production build locally
- `npm run lint` runs ESLint
- `npm run test` runs the Vitest suite once
- `npm run test:watch` runs Vitest in watch mode

## Project Structure

```text
src/
  components/
    weather/    Weather-specific UI
    ui/         Shared shadcn/ui components
  hooks/        App state for weather, theme, units, and favorites
  lib/          API clients and utility helpers
  pages/        Route-level pages
  test/         Test setup and examples
public/         Static assets
```

## Data Source

Weather, forecast, air quality, UV, alerts, and geocoding data come from [OpenWeather](https://openweathermap.org/).

The current project stores the OpenWeather API key directly in:

- `src/lib/weather-api.ts`
- `src/lib/geocoding-api.ts`

For production use, move that key to environment variables and avoid exposing sensitive credentials in client-side source code.

## Deployment

The repo includes a `vercel.json` rewrite so client-side routing works when deployed to Vercel.

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

## Notes

- Theme, favorites, and unit preferences are persisted in `localStorage`
- If the user denies geolocation access, the app falls back to manual search
- Weather alerts and UV data depend on API availability for the selected location
