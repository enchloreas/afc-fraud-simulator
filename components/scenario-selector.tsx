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
    <div className="flex flex-wrap gap-3">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onSelect(scenario.id)}
          disabled={disabled}
          className={cn(
            "flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all",
            selectedId === scenario.id
              ? scenario.id === "high_risk_merchant"
                ? "border-yellow-500 bg-yellow-500/10 text-yellow-300"
                : scenario.type === "fraud"
                  ? "border-red-500 bg-red-500/10 text-red-300"
                  : "border-green-500 bg-green-500/10 text-green-300"
              : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              selectedId === scenario.id
                ? scenario.id === "high_risk_merchant"
                  ? "bg-yellow-500/20"
                  : scenario.type === "fraud"
                    ? "bg-red-500/20"
                    : "bg-green-500/20"
                : "bg-slate-700"
            )}
          >
            {scenarioIcons[scenario.id]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{scenario.name}</span>
              {scenario.id === "high_risk_merchant" ? (
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />
              ) : scenario.type === "fraud" ? (
                <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5 text-green-400" />
              )}
            </div>
            <span className="text-xs text-slate-500">{scenario.description}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
