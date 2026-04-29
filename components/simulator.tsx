"use client"

import { useState, useCallback } from "react"
import { TerminalPanel } from "./terminal-panel"
import { ReasoningPanel } from "./reasoning-panel"
import { MobilePanel } from "./mobile-panel"
import { ScenarioSelector } from "./scenario-selector"
import { Button } from "@/components/ui/button"
import { scenarios, generateScenarioData } from "@/lib/scenarios"
import type { TerminalState, SimulatorOutput } from "@/lib/types"
import { Play, RotateCcw } from "lucide-react"

type SimulatorPhase = "idle" | "terminal" | "reasoning" | "mobile" | "complete"

export function Simulator() {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0].id)
  const [phase, setPhase] = useState<SimulatorPhase>("idle")
  const [terminalState, setTerminalState] = useState<TerminalState>("idle")
  const [simulatorOutput, setSimulatorOutput] = useState<SimulatorOutput | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

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

  const isRunning = phase !== "idle" && phase !== "complete"

  return (
    <div className="flex h-screen flex-col bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">AFC Fraud Simulator</h1>
            <p className="text-sm text-slate-400">Aktia Bank - Anti-Fraud Control Intelligence Engine</p>
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
              className="gap-2 bg-[#002E6E] hover:bg-[#003d8f]"
            >
              <Play className="h-4 w-4" />
              {isRunning ? "Running..." : "Run Simulation"}
            </Button>
          </div>
        </div>
      </header>

      {/* Scenario Selector */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4">
        <div className="mb-2 text-sm font-medium text-slate-400">Select Scenario</div>
        <ScenarioSelector
          scenarios={scenarios}
          selectedId={selectedScenario}
          onSelect={setSelectedScenario}
          disabled={isRunning}
        />
      </div>

      {/* Main 3-Panel Layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Panel 1: Terminal */}
        <div className="w-1/3 border-r border-slate-800 bg-slate-900/30 p-6">
          <TerminalPanel
            state={terminalState}
            payload={simulatorOutput?.panel_left_json || null}
          />
        </div>

        {/* Panel 2: Reasoning */}
        <div className="w-1/3 border-r border-slate-800 bg-slate-900/20 p-6">
          <ReasoningPanel
            reasoning={simulatorOutput?.panel_center_reasoning || null}
            isProcessing={phase === "reasoning"}
            isComplete={phase === "complete"}
            onComplete={handleReasoningComplete}
          />
        </div>

        {/* Panel 3: Mobile */}
        <div className="w-1/3 bg-slate-900/10 p-6">
          <MobilePanel
            mobile={simulatorOutput?.panel_right_mobile || null}
            isVisible={phase === "mobile" || phase === "complete"}
            onVerificationComplete={handleVerificationComplete}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Aktia Bank AFC Intelligence Engine v1.0</span>
          <div className="flex items-center gap-4">
            <span>
              Phase:{" "}
              <span className="font-medium text-slate-400">
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
