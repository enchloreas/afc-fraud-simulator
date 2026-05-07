"use client"

import { useEffect, useState } from "react"
import type { TerminalState, TransactionPayload } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TerminalPanelProps {
  state: TerminalState
  payload: TransactionPayload | null
  onComplete?: () => void
}

const terminalMessages: Record<TerminalState, string> = {
  idle: "Ready for Payment",
  insert_card: "Insert or Tap Card",
  reading_card: "Reading Card...",
  authorizing: "Authorizing...",
  processing: "PENDING REVIEW",
  approved: "APPROVED",
  declined: "DECLINED",
}

export function TerminalPanel({ state, payload, onComplete }: TerminalPanelProps) {
  const [displayState, setDisplayState] = useState<TerminalState>("idle")
  const [showPayload, setShowPayload] = useState(false)

  useEffect(() => {
    setDisplayState(state)
    // Show payload for approved, declined, or processing (pending review) states
    if (state === "approved" || state === "declined" || state === "processing") {
      setTimeout(() => setShowPayload(true), 500)
    } else {
      setShowPayload(false)
    }
  }, [state])

  const getStatusColor = () => {
    switch (displayState) {
      case "approved":
        return "text-green-400"
      case "declined":
        return "text-red-400"
      case "authorizing":
      case "processing":
        return "text-yellow-400"
      default:
        return "text-gray-300"
    }
  }

  const isProcessing = displayState === "authorizing" || displayState === "processing" || displayState === "reading_card"

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 border-b border-border pb-3">
        <h2 className="text-lg font-bold text-foreground">Payment Terminal</h2>
        <p className="text-sm text-muted-foreground">POS Hardware Emulator</p>
      </div>

      {/* Terminal Screen */}
      <Card className="mb-4 border-2 border-border bg-card shadow-lg">
        <CardContent className="p-0">
          <div className="rounded-t-lg bg-secondary px-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">VERIFONE</span>
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-aktia-green" />
                <div className="h-2 w-2 rounded-full bg-amber-500" />
              </div>
            </div>
          </div>
          <div className="flex min-h-[120px] flex-col items-center justify-center bg-aktia-dark p-6 font-mono">
            {isProcessing && (
              <div className="mb-2 flex gap-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            <span className={cn("text-xl font-bold tracking-wide", getStatusColor())}>
              {terminalMessages[displayState]}
            </span>
            {payload && displayState !== "idle" && displayState !== "insert_card" && (
              <span className="mt-2 text-lg text-white">
                {payload.currency} {payload.amount.toFixed(2)}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1 bg-secondary p-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
              <div
                key={key}
                className="flex h-8 items-center justify-center rounded bg-muted text-sm font-medium text-muted-foreground"
              >
                {key}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Raw JSON Payload */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mb-2 flex shrink-0 items-center justify-between">
          <h3 className="text-sm font-medium text-foreground/80">Raw Transaction Payload</h3>
          {showPayload && (
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">TRANSMITTED</span>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-border bg-secondary/30 p-3 font-mono">
          {payload && showPayload ? (
            <pre className="text-xs leading-relaxed text-foreground/70">
              <code>{JSON.stringify(payload, null, 2)}</code>
            </pre>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {state === "idle" ? "Waiting for transaction..." : "Generating payload..."}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
