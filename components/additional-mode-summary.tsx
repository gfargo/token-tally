"use client";

import type { AdditionalPricingMode } from "@/types/pricing";

const unitLabels: Record<string, string> = {
  per1Mtokens: "per 1M tokens",
  per1Ktokens: "per 1K tokens",
  per10Ktokens: "per 10K tokens",
  perImage: "per image",
  perRequest: "per request",
  perMinute: "per minute",
  perHour: "per hour",
  perSecond: "per second",
  perMonth: "per month",
  perSeat: "per seat",
  perSeatMonthly: "per seat (monthly)",
  perCredit: "per credit",
  perBundle: "per bundle",
  flat: "flat fee",
};

const formatCurrency = (value: number) => {
  const fractionDigits = value < 1 ? 3 : 2;
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
};

export const AdditionalModeSummary = ({
  mode,
}: {
  mode: AdditionalPricingMode;
}) => {
  const unit = unitLabels[mode.unit] ?? mode.unit;

  if (mode.type === "token") {
    const parts: string[] = [];
    if (typeof mode.input === "number") {
      parts.push(`Input ${formatCurrency(mode.input)}`);
    }
    if (typeof mode.output === "number") {
      parts.push(`Output ${formatCurrency(mode.output)}`);
    }
    if (typeof mode.cachedInput === "number") {
      parts.push(`Cached ${formatCurrency(mode.cachedInput)}`);
    }
    if (typeof mode.min === "number" || typeof mode.max === "number") {
      const min = typeof mode.min === "number" ? formatCurrency(mode.min) : "";
      const max = typeof mode.max === "number" ? formatCurrency(mode.max) : "";
      parts.push(`Range ${[min, max].filter(Boolean).join(" – ")}`);
    }

    return (
      <div className="space-y-1">
        <p className="text-sm font-medium">Token • {unit}</p>
        {parts.length > 0 && (
          <p className="text-xs text-muted-foreground">{parts.join(" · ")}</p>
        )}
        {mode.description && (
          <p className="text-xs text-muted-foreground">{mode.description}</p>
        )}
      </div>
    );
  }

  if (mode.type === "subscription") {
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium">
          Subscription • {formatCurrency(mode.price)} {unit}
        </p>
        {mode.usageIncluded && (
          <p className="text-xs text-muted-foreground">
            Includes {mode.usageIncluded}
          </p>
        )}
        {mode.features?.length ? (
          <p className="text-xs text-muted-foreground">
            {mode.features.join(", ")}
          </p>
        ) : null}
        {mode.description && (
          <p className="text-xs text-muted-foreground">{mode.description}</p>
        )}
      </div>
    );
  }

  if (mode.type === "credit") {
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium">
          Credits • {formatCurrency(mode.price)} {unit}
        </p>
        {typeof mode.creditsIncluded === "number" && (
          <p className="text-xs text-muted-foreground">
            Includes {mode.creditsIncluded} credits
          </p>
        )}
        {mode.usageIncluded && (
          <p className="text-xs text-muted-foreground">
            Covers {mode.usageIncluded}
          </p>
        )}
        {mode.description && (
          <p className="text-xs text-muted-foreground">{mode.description}</p>
        )}
      </div>
    );
  }

  if (mode.type === "compute") {
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium">
          Compute • {formatCurrency(mode.price)} {unit}
        </p>
        {mode.usageIncluded && (
          <p className="text-xs text-muted-foreground">{mode.usageIncluded}</p>
        )}
        {mode.description && (
          <p className="text-xs text-muted-foreground">{mode.description}</p>
        )}
      </div>
    );
  }

  if (mode.type === "range") {
    const min = formatCurrency(mode.min);
    const max = formatCurrency(mode.max);
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium">
          Range • {min} – {max} {unit}
        </p>
        {mode.description && (
          <p className="text-xs text-muted-foreground">{mode.description}</p>
        )}
      </div>
    );
  }

  return null;
};
