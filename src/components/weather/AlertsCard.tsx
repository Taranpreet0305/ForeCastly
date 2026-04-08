import { AlertTriangle } from "lucide-react";
import type { WeatherAlert } from "@/lib/weather-api";

interface AlertsCardProps {
  alerts: WeatherAlert[];
  timezone: number;
}

export function AlertsCard({ alerts, timezone }: AlertsCardProps) {
  if (alerts.length === 0) return null;

  const formatAlertTime = (unix: number) => {
    const date = new Date((unix + timezone) * 1000);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  return (
    <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-5 animate-fade-up" style={{ animationDelay: "0.05s" }}>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <h3 className="text-xs font-medium uppercase tracking-widest text-destructive">
          Weather Alerts
        </h3>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div key={i} className={i < alerts.length - 1 ? "pb-3 border-b border-destructive/10" : ""}>
            <p className="text-sm font-semibold text-foreground">{alert.event}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatAlertTime(alert.start)} — {formatAlertTime(alert.end)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
              {alert.description}
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-1">
              Source: {alert.sender_name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
