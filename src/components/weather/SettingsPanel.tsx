import { Settings, Moon, Sun } from "lucide-react";
import { useUnits, type TempUnit, type WindUnit } from "@/hooks/use-units";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";

const tempOptions: { value: TempUnit; label: string }[] = [
  { value: "celsius", label: "°C" },
  { value: "fahrenheit", label: "°F" },
];

const windOptions: { value: WindUnit; label: string }[] = [
  { value: "ms", label: "m/s" },
  { value: "kmh", label: "km/h" },
  { value: "mph", label: "mph" },
];

export function SettingsPanel() {
  const { tempUnit, windUnit, setTempUnit, setWindUnit } = useUnits();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const ToggleButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="h-11 w-11 rounded-md bg-card border border-border flex items-center justify-center hover:shadow-md active:scale-95 transition-all"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 weather-glass rounded-2xl p-4 w-56 shadow-xl animate-fade-up border border-border/50">
            {/* Theme */}
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Appearance
            </p>
            <div className="flex gap-1.5 mb-4">
              <ToggleButton active={theme === "light"} onClick={() => theme !== "light" && toggleTheme()}>
                <span className="flex items-center justify-center gap-1.5">
                  <Sun className="h-3.5 w-3.5" /> Light
                </span>
              </ToggleButton>
              <ToggleButton active={theme === "dark"} onClick={() => theme !== "dark" && toggleTheme()}>
                <span className="flex items-center justify-center gap-1.5">
                  <Moon className="h-3.5 w-3.5" /> Dark
                </span>
              </ToggleButton>
            </div>

            {/* Temperature */}
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Temperature
            </p>
            <div className="flex gap-1.5 mb-4">
              {tempOptions.map((o) => (
                <ToggleButton key={o.value} active={tempUnit === o.value} onClick={() => setTempUnit(o.value)}>
                  {o.label}
                </ToggleButton>
              ))}
            </div>

            {/* Wind */}
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Wind Speed
            </p>
            <div className="flex gap-1.5">
              {windOptions.map((o) => (
                <ToggleButton key={o.value} active={windUnit === o.value} onClick={() => setWindUnit(o.value)}>
                  {o.label}
                </ToggleButton>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
