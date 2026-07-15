import { cn } from "@/lib/utils";

interface CrewsGlassBackgroundProps {
  variant?: "hero" | "full";
  className?: string;
}

/**
 * Glass Orb + grid background adapted to CREWS palette
 * (naranja CREWS + morado/rosa neón sobre negro profundo).
 * 100% SVG + CSS, respeta prefers-reduced-motion.
 */
export function CrewsGlassBackground({
  variant = "hero",
  className,
}: CrewsGlassBackgroundProps) {
  const orbSize =
    variant === "full"
      ? "w-[90vw] max-w-[900px]"
      : "w-[75vw] max-w-[1100px]";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(240 15% 4%) 0%, hsl(240 12% 8%) 50%, hsl(240 10% 12%) 100%)",
        }}
      />

      {/* Grid overlay with radial fade */}
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100% / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 1) 1px, transparent 1px)",
          backgroundSize: "clamp(120px, 14vw, 220px) clamp(120px, 14vw, 220px)",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 85%)",
        }}
      />

      {/* Ambient color washes (subtle) */}
      <div className="absolute -top-1/3 left-1/4 w-[70vw] h-[70vw] rounded-full bg-neon-purple/10 blur-3xl" />
      <div className="absolute -bottom-1/3 right-1/4 w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-3xl" />

      {/* Glass Orb */}
      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          orbSize,
          "motion-safe:animate-[glass-float_9s_ease-in-out_infinite]",
        )}
      >
        <svg
          viewBox="0 0 1200 520"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Glass gradient */}
            <linearGradient id="glassBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(0 0% 100%)" stopOpacity="0.28" />
              <stop offset="50%" stopColor="hsl(0 0% 100%)" stopOpacity="0.10" />
              <stop offset="100%" stopColor="hsl(0 0% 100%)" stopOpacity="0.18" />
            </linearGradient>

            {/* Rim gradient — CREWS neon */}
            <linearGradient id="rim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(24 95% 53%)" stopOpacity="0.9" />
              <stop offset="45%" stopColor="hsl(270 91% 65%)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="hsl(330 85% 60%)" stopOpacity="0.9" />
            </linearGradient>

            {/* Top highlight */}
            <linearGradient id="topShine" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="hsl(0 0% 100%)" stopOpacity="0.55" />
              <stop offset="60%" stopColor="hsl(0 0% 100%)" stopOpacity="0" />
            </linearGradient>

            {/* Chromatic refraction (bottom edge) */}
            <linearGradient id="chroma" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(24 95% 53%)" stopOpacity="0" />
              <stop offset="30%" stopColor="hsl(24 95% 53%)" stopOpacity="0.9" />
              <stop offset="55%" stopColor="hsl(330 85% 60%)" stopOpacity="0.9" />
              <stop offset="80%" stopColor="hsl(217 91% 60%)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity="0" />
            </linearGradient>

            {/* Blur filter for soft glass feel */}
            <filter id="softBlur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="0.6" />
            </filter>

            {/* Glow for rim */}
            <filter id="rimGlow" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/*
            "Peanut" silhouette: two fused rounded capsules.
            Small left lobe (r ~ 180) merging into a larger right capsule.
          */}
          <g filter="url(#softBlur)">
            <path
              d="
                M 340 260
                a 180 180 0 1 1 200 90
                L 900 350
                a 170 170 0 0 0 0 -180
                L 540 170
                a 180 180 0 0 1 -200 90
                Z
              "
              fill="url(#glassBody)"
              stroke="url(#rim)"
              strokeWidth="2.5"
            />
          </g>

          {/* Rim glow overlay */}
          <path
            d="
              M 340 260
              a 180 180 0 1 1 200 90
              L 900 350
              a 170 170 0 0 0 0 -180
              L 540 170
              a 180 180 0 0 1 -200 90
              Z
            "
            fill="none"
            stroke="url(#rim)"
            strokeWidth="1.5"
            opacity="0.6"
            filter="url(#rimGlow)"
          />

          {/* Top highlight (blown-glass sheen) */}
          <ellipse
            cx="600"
            cy="180"
            rx="380"
            ry="40"
            fill="url(#topShine)"
            opacity="0.6"
          />
          <ellipse
            cx="380"
            cy="200"
            rx="90"
            ry="18"
            fill="hsl(0 0% 100%)"
            opacity="0.35"
          />

          {/* Chromatic refraction line at the bottom */}
          <path
            d="M 300 358 Q 600 380 900 350"
            stroke="url(#chroma)"
            strokeWidth="3"
            fill="none"
            opacity="0.85"
            filter="url(#rimGlow)"
          />
        </svg>
      </div>

      {/* Vignette to focus content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, hsl(240 15% 4% / 0.6) 100%)",
        }}
      />
    </div>
  );
}
