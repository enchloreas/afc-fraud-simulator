"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import type { ReasoningStep, PanelCenterReasoning } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react"

interface ReasoningPanelProps {
  reasoning: PanelCenterReasoning | null
  isProcessing: boolean
  isComplete?: boolean
  onComplete?: () => void
}

export function ReasoningPanel({ reasoning, isProcessing, isComplete, onComplete }: ReasoningPanelProps) {
  const [visibleSteps, setVisibleSteps] = useState<ReasoningStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasStartedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Reset only when reasoning data becomes null (reset button clicked)
  useEffect(() => {
    if (!reasoning) {
      setVisibleSteps([])
      setCurrentStep(0)
      setShowScore(false)
      hasStartedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [reasoning])

  // Handle step animation when processing starts
  useEffect(() => {
    if (!reasoning || !isProcessing) {
      return
    }

    // Only start animation once
    if (hasStartedRef.current) {
      return
    }
    hasStartedRef.current = true

    const steps = reasoning.steps
    let stepIndex = 0

    intervalRef.current = setInterval(() => {
      if (stepIndex < steps.length) {
        setVisibleSteps((prev) => [...prev, { ...steps[stepIndex], status: "complete" }])
        setCurrentStep(stepIndex + 1)
        stepIndex++
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        setTimeout(() => {
          setShowScore(true)
          onCompleteRef.current?.()
        }, 300)
      }
    }, 400)

    return () => {
      // Don't clear interval on cleanup - let it finish
    }
  }, [reasoning, isProcessing])

  const getStepIcon = (step: ReasoningStep) => {
    if (step.status === "processing") {
      return <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
    }
    switch (step.result) {
      case "pass":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-slate-600" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score <= 30) return "text-green-400"
    if (score <= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score <= 30) return "bg-green-500"
    if (score <= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getVerdictText = (color: "green" | "yellow" | "red") => {
    switch (color) {
      case "green":
        return { text: "APPROVED", className: "text-green-400 bg-green-900/30" }
      case "yellow":
        return { text: "REVIEW", className: "text-yellow-400 bg-yellow-900/30" }
      case "red":
        return { text: "BLOCKED", className: "text-red-400 bg-red-900/30" }
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 border-b border-slate-700 pb-3">
        <h2 className="text-lg font-semibold text-white">Agent&apos;s Eyes</h2>
        <p className="text-sm text-slate-400">Real-time Fraud Analysis</p>
      </div>

      {/* Reasoning Steps */}
      <div className="flex-1 overflow-auto pr-2">
        {visibleSteps.length === 0 && !isProcessing && !isComplete ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-slate-600">
                <Loader2 className="h-6 w-6 text-slate-500" />
              </div>
              <p className="text-sm text-slate-500">Waiting for transaction data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleSteps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 transition-all duration-300",
                  step.result === "fail" && "border-red-900/50 bg-red-900/10",
                  step.result === "warning" && "border-yellow-900/50 bg-yellow-900/10"
                )}
                style={{
                  animation: "fadeSlideIn 0.3s ease-out",
                  animationFillMode: "both",
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="mt-0.5">{getStepIcon(step)}</div>
                <span
                  className={cn(
                    "text-sm",
                    step.result === "pass" && "text-slate-300",
                    step.result === "fail" && "text-red-300",
                    step.result === "warning" && "text-yellow-300"
                  )}
                >
                  {step.text}
                </span>
              </div>
            ))}

            {isProcessing && currentStep < (reasoning?.steps.length || 0) && (
              <div className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                <span className="text-sm text-blue-300">Processing...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Risk Score */}
      {showScore && reasoning && (
        <div className="mt-4 border-t border-slate-700 pt-4">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Risk Score</span>
              <span className={cn("text-2xl font-bold", getScoreColor(reasoning.risk_score))}>
                {reasoning.risk_score}/100
              </span>
            </div>
            <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-700">
              <div
                className={cn("h-full transition-all duration-1000", getScoreBg(reasoning.risk_score))}
                style={{ width: `${reasoning.risk_score}%` }}
              />
            </div>
            <div className="flex justify-center">
              <span
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-semibold",
                  getVerdictText(reasoning.verdict_color).className
                )}
              >
                {getVerdictText(reasoning.verdict_color).text}
              </span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
