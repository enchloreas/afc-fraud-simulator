"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { TerminalPanel } from "./terminal-panel"
import { ReasoningPanel } from "./reasoning-panel"
import { MobilePanel } from "./mobile-panel"
import { ScenarioSelector } from "./scenario-selector"
import { Button } from "@/components/ui/button"
import { scenarios, generateScenarioData } from "@/lib/scenarios"
import type { TerminalState, SimulatorOutput } from "@/lib/types"
import { Play, RotateCcw, Monitor, Smartphone } from "lucide-react"
import { useIsMobile } from "@/components/ui/use-mobile"
import { cn } from "@/lib/utils"

type SimulatorPhase = "idle" | "terminal" | "reasoning" | "mobile" | "complete"

type ViewMode = "desktop" | "mobile"
type MobileTab = "terminal" | "reasoning" | "mobile"

export function Simulator() {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0].id)
  const [phase, setPhase] = useState<SimulatorPhase>("idle")
  const [terminalState, setTerminalState] = useState<TerminalState>("idle")
  const [simulatorOutput, setSimulatorOutput] = useState<SimulatorOutput | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("mobile")
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>("terminal")
  const isMobile = useIsMobile()

  const runSimulation = useCallback(() => {
    const output = generateScenarioData(selectedScenario)
    setSimulatorOutput(output)
    setPhase("terminal")
    setIsProcessing(true)

    // Terminal animation sequence
    setTerminalState("insert_card")
    setTimeout(() => setTerminalState("reading_card"), 800)
    setTimeout(() => setTerminalState("authorizing"), 1600)
    setTimeout(() => setTerminalState("processing"), 2400)
    setTimeout(() => {
      const verdictColor = output.panel_center_reasoning.verdict_color
      // Yellow verdict shows as "processing" state on terminal (pending review)
      setTerminalState(verdictColor === "green" ? "approved" : verdictColor === "yellow" ? "processing" : "declined")
      setPhase("reasoning")
    }, 3200)
  }, [selectedScenario])

  const handleReasoningComplete = useCallback(() => {
    setPhase("mobile")
    setTimeout(() => {
      setPhase("complete")
      setIsProcessing(false)
    }, 500)
  }, [])

  const resetSimulation = useCallback(() => {
    setPhase("idle")
    setTerminalState("idle")
    setSimulatorOutput(null)
    setIsProcessing(false)
  }, [])

  const handleVerificationComplete = useCallback(() => {
    // Update terminal to approved when identity verification succeeds
    setTerminalState("approved")
  }, [])

  const handleFraudReport = useCallback(() => {
    // Update terminal to declined when user reports fraud
    setTerminalState("declined")
  }, [])

  const isRunning = phase !== "idle" && phase !== "complete"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 md:px-6 md:py-4">
        {/* Desktop Header Layout */}
        {!isMobile && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/images/afc-logo.jpg"
                alt="AFC Logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Aktia TrustControl AFC Fraud Simulator</h1>
                <p className="text-sm text-muted-foreground">Aktia Bank - Anti-Fraud Control Intelligence Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {phase === "complete" && (
                <Button variant="outline" onClick={resetSimulation} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              )}
              <Button
                onClick={runSimulation}
                disabled={isRunning}
                className="gap-2 bg-aktia-green text-white shadow-md hover:bg-aktia-green-hover hover:shadow-lg disabled:opacity-60"
              >
                <Play className="h-4 w-4" />
                {isRunning ? "Running..." : "Run Simulation"}
              </Button>
            </div>
          </div>
        )}

        {/* Mobile Header Layout */}
        {isMobile && (
          <div className="flex flex-col gap-3">
            {/* Logo and App Name */}
            <div className="flex items-center gap-3">
              <Image
                src="/images/afc-logo.jpg"
                alt="AFC Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <h1 className="text-lg font-bold text-foreground">AFC Fraud Simulator</h1>
            </div>

            {/* Controls Panel */}
            <div className="flex items-center justify-between gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center rounded-lg border border-border bg-secondary p-1">
                <button
                  onClick={() => setViewMode("desktop")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                    viewMode === "desktop"
                      ? "bg-aktia-green text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  Desktop
                </button>
                <button
                  onClick={() => setViewMode("mobile")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                    viewMode === "mobile"
                      ? "bg-aktia-green text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  Mobile
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {phase === "complete" && (
                  <Button variant="outline" onClick={resetSimulation} size="sm" className="gap-1.5 px-2">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                )}
                <Button
                  onClick={runSimulation}
                  disabled={isRunning}
                  size="sm"
                  className="gap-1.5 bg-aktia-green px-3 text-white shadow-md hover:bg-aktia-green-hover hover:shadow-lg disabled:opacity-60"
                >
                  <Play className="h-3.5 w-3.5" />
                  {isRunning ? "Running..." : "Run"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Scenario Selector */}
      <div className="border-b border-border bg-card/50 px-4 py-3 md:px-6 md:py-4">
        <div className="mb-2 text-sm font-medium text-muted-foreground">Select Scenario</div>
        <ScenarioSelector
          scenarios={scenarios}
          selectedId={selectedScenario}
          onSelect={setSelectedScenario}
          disabled={isRunning}
        />
      </div>

      {/* Main 3-Panel Layout */}
      <main className="flex min-h-[500px] flex-1">
        {/* Desktop Layout or Desktop View on Mobile */}
        {(!isMobile || viewMode === "desktop") && (
          <div className={cn(
            "flex",
            isMobile && viewMode === "desktop" ? "w-[200%] origin-top-left scale-50" : "w-full"
          )}>
            {/* Panel 1: Terminal */}
            <div className="w-1/3 overflow-auto border-r border-border bg-card p-6">
              <TerminalPanel
                state={terminalState}
                payload={simulatorOutput?.panel_left_json || null}
              />
            </div>

            {/* Panel 2: Reasoning */}
            <div className="w-1/3 overflow-auto border-r border-border bg-secondary/50 p-6">
              <ReasoningPanel
                reasoning={simulatorOutput?.panel_center_reasoning || null}
                isProcessing={phase === "reasoning"}
                isComplete={phase === "complete"}
                onComplete={handleReasoningComplete}
              />
            </div>

            {/* Panel 3: Mobile */}
            <div className="w-1/3 overflow-auto bg-muted/30 p-6">
              <MobilePanel
                mobile={simulatorOutput?.panel_right_mobile || null}
                isVisible={phase === "mobile" || phase === "complete"}
                onVerificationComplete={handleVerificationComplete}
                onFraudReport={handleFraudReport}
                terminalState={terminalState}
              />
            </div>
          </div>
        )}

        {/* Mobile-Optimized Layout with Tabs */}
        {isMobile && viewMode === "mobile" && (
          <div className="flex w-full flex-col">
            {/* Tab Navigation */}
            <div className="flex border-b border-border bg-card/50">
              <button
                onClick={() => setActiveMobileTab("terminal")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-all",
                  activeMobileTab === "terminal"
                    ? "border-b-2 border-aktia-green text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Terminal
              </button>
              <button
                onClick={() => setActiveMobileTab("reasoning")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-all",
                  activeMobileTab === "reasoning"
                    ? "border-b-2 border-aktia-green text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Analysis
              </button>
              <button
                onClick={() => setActiveMobileTab("mobile")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-all",
                  activeMobileTab === "mobile"
                    ? "border-b-2 border-aktia-green text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Aktia Mobile
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-0 flex-1 overflow-auto p-4">
              {/* Terminal Tab */}
              <div className={activeMobileTab === "terminal" ? "block" : "hidden"}>
                <TerminalPanel
                  state={terminalState}
                  payload={simulatorOutput?.panel_left_json || null}
                />
              </div>
              {/* Reasoning Tab - Always rendered to run analysis in background */}
              <div className={activeMobileTab === "reasoning" ? "block" : "hidden"}>
                <ReasoningPanel
                  reasoning={simulatorOutput?.panel_center_reasoning || null}
                  isProcessing={phase === "reasoning"}
                  isComplete={phase === "complete"}
                  onComplete={handleReasoningComplete}
                />
              </div>
              {/* Mobile Tab */}
              <div className={activeMobileTab === "mobile" ? "block" : "hidden"}>
                <MobilePanel
                  mobile={simulatorOutput?.panel_right_mobile || null}
                  isVisible={phase === "mobile" || phase === "complete"}
                  onVerificationComplete={handleVerificationComplete}
                  onFraudReport={handleFraudReport}
                  terminalState={terminalState}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-2 md:px-6 md:py-3">
        <div className="flex flex-col items-start gap-1 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:gap-0">
          <span>Aktia Bank AFC Intelligence Engine v1.0</span>
          <div className="flex items-center gap-4">
            <span>
              Phase:{" "}
              <span className="font-medium text-foreground/70">
                {phase === "idle" && "Ready"}
                {phase === "terminal" && "Processing Transaction"}
                {phase === "reasoning" && "Analyzing"}
                {phase === "mobile" && "Sending Notification"}
                {phase === "complete" && "Complete"}
              </span>
            </span>
            {simulatorOutput && (
              <span>
                Risk Score:{" "}
                <span
                  className={
                    simulatorOutput.panel_center_reasoning.risk_score <= 30
                      ? "text-green-400"
                      : simulatorOutput.panel_center_reasoning.risk_score <= 60
                        ? "text-yellow-400"
                        : "text-red-400"
                  }
                >
                  {simulatorOutput.panel_center_reasoning.risk_score}/100
                </span>
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
