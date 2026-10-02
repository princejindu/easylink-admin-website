"use client";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  subtitle?: string;
}

export function StatsCard({ title, value, icon: Icon, subtitle }: StatsCardProps) {
  return (
    <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Icon className="w-4 h-4" />
        <span>{title}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}
