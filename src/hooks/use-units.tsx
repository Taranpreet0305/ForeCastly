import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type TempUnit = "celsius" | "fahrenheit";
export type WindUnit = "ms" | "kmh" | "mph";

interface UnitsContextType {
  tempUnit: TempUnit;
  windUnit: WindUnit;
  setTempUnit: (u: TempUnit) => void;
  setWindUnit: (u: WindUnit) => void;
  convertTemp: (celsius: number) => number;
  tempLabel: string;
  convertWind: (ms: number) => number;
  windLabel: string;
}

const UnitsContext = createContext<UnitsContextType | null>(null);

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [tempUnit, setTempUnit] = useState<TempUnit>(
    () => (localStorage.getItem("skycast-temp") as TempUnit) || "celsius"
  );
  const [windUnit, setWindUnit] = useState<WindUnit>(
    () => (localStorage.getItem("skycast-wind") as WindUnit) || "ms"
  );

  const handleTempUnit = useCallback((u: TempUnit) => {
    setTempUnit(u);
    localStorage.setItem("skycast-temp", u);
  }, []);

  const handleWindUnit = useCallback((u: WindUnit) => {
    setWindUnit(u);
    localStorage.setItem("skycast-wind", u);
  }, []);

  const convertTemp = useCallback(
    (c: number) => (tempUnit === "fahrenheit" ? c * 9 / 5 + 32 : c),
    [tempUnit]
  );

  const convertWind = useCallback(
    (ms: number) => {
      if (windUnit === "kmh") return ms * 3.6;
      if (windUnit === "mph") return ms * 2.237;
      return ms;
    },
    [windUnit]
  );

  const tempLabel = tempUnit === "fahrenheit" ? "°F" : "°C";
  const windLabel = windUnit === "kmh" ? "km/h" : windUnit === "mph" ? "mph" : "m/s";

  return (
    <UnitsContext.Provider
      value={{ tempUnit, windUnit, setTempUnit: handleTempUnit, setWindUnit: handleWindUnit, convertTemp, tempLabel, convertWind, windLabel }}
    >
      {children}
    </UnitsContext.Provider>
  );
}

export function useUnits() {
  const ctx = useContext(UnitsContext);
  if (!ctx) throw new Error("useUnits must be used within UnitsProvider");
  return ctx;
}
