import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor?: "purple" | "pink" | "blue" | "green" | "yellow" | "orange";
  delay?: number;
}

const iconColorClasses = {
  purple: "text-neon-purple bg-neon-purple/10",
  pink: "text-neon-pink bg-neon-pink/10",
  blue: "text-neon-blue bg-neon-blue/10",
  green: "text-neon-green bg-neon-green/10",
  yellow: "text-neon-yellow bg-neon-yellow/10",
  orange: "text-neon-orange bg-neon-orange/10",
};

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = "purple",
  delay = 0,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card variant="neon" className="p-5 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold font-display tracking-tight">{value}</p>
            {(trend || subtitle) && (
              <div className="flex items-center gap-2">
                {trend && (
                  <span
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      trend.isPositive ? "text-success" : "text-destructive"
                    )}
                  >
                    {trend.isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {trend.value}%
                  </span>
                )}
                {subtitle && (
                  <span className="text-sm text-muted-foreground">{subtitle}</span>
                )}
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", iconColorClasses[iconColor])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
