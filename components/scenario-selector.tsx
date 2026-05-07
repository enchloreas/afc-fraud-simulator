"use client"

import type { Scenario } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle, CreditCard, Globe, ShieldAlert, Plane } from "lucide-react"

interface ScenarioSelectorProps {
  scenarios: Scenario[]
  selectedId: string
  onSelect: (id: string) => void
  disabled?: boolean
}

const scenarioIcons: Record<string, React.ReactNode> = {
  legitimate_local: <CreditCard className="h-5 w-5" />,
  legitimate_travel: <Plane className="h-5 w-5" />,
  impossible_travel: <Globe className="h-5 w-5" />,
  high_risk_merchant: <ShieldAlert className="h-5 w-5" />,
}

export function ScenarioSelector({ scenarios, selectedId, onSelect, disabled }: ScenarioSelectorProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-3">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onSelect(scenario.id)}
          disabled={disabled}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left shadow-sm transition-all hover:shadow-md md:w-auto md:gap-3 md:px-4 md:py-3",
            selectedId === scenario.id
              ? scenario.id === "high_risk_merchant"
                ? "border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-200"
                : scenario.type === "fraud"
                  ? "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-200"
                  : "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200"
              : "border-border bg-card text-muted-foreground hover:border-aktia-green/50 hover:bg-secondary",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg md:h-10 md:w-10",
              selectedId === scenario.id
                ? scenario.id === "high_risk_merchant"
                  ? "bg-amber-100 text-amber-600"
                  : scenario.type === "fraud"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {scenarioIcons[scenario.id]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{scenario.name}</span>
              {scenario.id === "high_risk_merchant" ? (
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />
              ) : scenario.type === "fraud" ? (
                <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5 text-green-400" />
              )}
            </div>
            <span className="text-xs text-muted-foreground">{scenario.description}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
