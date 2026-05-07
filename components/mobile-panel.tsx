"use client"

import { useEffect, useState } from "react"
import type { PanelRightMobile } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Shield, CheckCircle, Phone, ChevronRight, Wifi, Battery, Signal, AlertTriangle, Fingerprint, Loader2, ShieldAlert, XCircle } from "lucide-react"
import type { TerminalState } from "@/lib/types"

interface MobilePanelProps {
  mobile: PanelRightMobile | null
  isVisible: boolean
  onVerificationComplete?: () => void
  onFraudReport?: () => void
  terminalState?: TerminalState
}

export function MobilePanel({ mobile, isVisible, onVerificationComplete, onFraudReport, terminalState }: MobilePanelProps) {
  const [showContent, setShowContent] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [verificationState, setVerificationState] = useState<"idle" | "verifying" | "verified">("idle")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDeclined, setShowDeclined] = useState(false)
  const [reportingFraud, setReportingFraud] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setShowContent(true), 300)
    } else {
      setShowContent(false)
      // Only reset verification state when mobile data changes (new simulation)
      // Don't reset just because tab was switched
    }
  }, [isVisible])

  // Reset state when mobile data changes (new simulation started)
  useEffect(() => {
    if (!mobile) {
      setVerificationState("idle")
      setShowSuccess(false)
      setShowDeclined(false)
      setReportingFraud(false)
    }
  }, [mobile])

  // Sync state with terminal state (for when terminal is updated externally)
  useEffect(() => {
    if (terminalState === "approved" && verificationState === "verified") {
      setShowSuccess(true)
    }
  }, [terminalState, verificationState])

  const isAlert = mobile?.view_type === "SECURITY_ALERT_VIEW"
  const isVerification = mobile?.view_type === "IDENTITY_VERIFICATION_VIEW"

  const handleVerifyIdentity = () => {
    setVerificationState("verifying")
    setTimeout(() => {
      setVerificationState("verified")
      setTimeout(() => {
        setShowSuccess(true)
        // Notify parent that verification is complete so terminal can update
        onVerificationComplete?.()
      }, 500)
    }, 2000)
  }

  const handleReportFraud = () => {
    setReportingFraud(true)
    setTimeout(() => {
      setShowDeclined(true)
      // Notify parent to decline transaction
      onFraudReport?.()
    }, 1500)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 border-b border-border pb-3">
        <h2 className="text-lg font-semibold text-foreground">Aktia Mobile</h2>
        <p className="text-sm text-muted-foreground">Customer Notification</p>
      </div>

      {/* Phone Frame */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-full max-w-[280px]">
          {/* Phone outer frame */}
          <div className="overflow-hidden rounded-[2.5rem] border-[8px] border-secondary bg-secondary shadow-2xl">
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-3 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

            {/* Screen */}
            <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-aktia-dark">
              {/* Status Bar */}
              <div className="flex items-center justify-between px-6 pb-2 pt-10 text-white">
                <span className="text-sm font-medium">{currentTime}</span>
                <div className="flex items-center gap-1">
                  <Signal className="h-4 w-4" />
                  <Wifi className="h-4 w-4" />
                  <Battery className="h-4 w-4" />
                </div>
              </div>

              {/* App Header */}
              <div className="border-b border-white/10 px-6 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aktia-green">
                    <span className="text-sm font-bold text-white">A</span>
                  </div>
                  <span className="text-lg font-semibold text-white">Aktia</span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6">
                {!showContent || !mobile ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="mb-4 h-12 w-12 animate-pulse rounded-full bg-white/20" />
                    <div className="h-4 w-32 animate-pulse rounded bg-white/20" />
                  </div>
                ) : (
                  <div
                    className="space-y-4"
                    style={{
                      animation: "fadeIn 0.5s ease-out",
                    }}
                  >
                    {/* Status Icon */}
                    <div className="flex justify-center">
                      <div
                        className={cn(
                          "flex h-16 w-16 items-center justify-center rounded-full",
                          showDeclined && "bg-red-500/20",
                          isAlert && !showDeclined && "bg-red-500/20",
                          isVerification && !showSuccess && !showDeclined && "bg-yellow-500/20",
                          ((!isAlert && !isVerification) || showSuccess) && !showDeclined ? "bg-green-500/20" : ""
                        )}
                      >
                        {showDeclined ? (
                          <XCircle className="h-8 w-8 text-red-400" />
                        ) : showSuccess ? (
                          <CheckCircle className="h-8 w-8 text-green-400" />
                        ) : isAlert ? (
                          <Shield className="h-8 w-8 text-red-400" />
                        ) : isVerification ? (
                          reportingFraud ? (
                            <Loader2 className="h-8 w-8 animate-spin text-red-400" />
                          ) : verificationState === "verifying" ? (
                            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
                          ) : verificationState === "verified" ? (
                            <CheckCircle className="h-8 w-8 text-green-400" />
                          ) : (
                            <AlertTriangle className="h-8 w-8 text-yellow-400" />
                          )
                        ) : (
                          <CheckCircle className="h-8 w-8 text-green-400" />
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="text-center">
                      <h3
                        className={cn(
                          "mb-2 text-xl font-bold",
                          showDeclined ? "text-red-400" : showSuccess ? "text-green-400" : isAlert ? "text-red-400" : isVerification ? "text-yellow-400" : "text-white"
                        )}
                      >
                        {showDeclined ? "Transaction Declined" : showSuccess ? "Payment Approved" : reportingFraud ? "Reporting..." : verificationState === "verifying" ? "Verifying..." : verificationState === "verified" ? "Identity Verified" : mobile.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/80">
                        {showDeclined ? "This transaction has been blocked and reported. Our team will review it." : showSuccess ? `€${mobile.description.includes("4,999") ? "4,999" : mobile.description.split("€")[1]?.split(" ")[0] || "4,999"} at CryptoGems Exchange` : reportingFraud ? "Please wait while we report this activity..." : verificationState === "verifying" ? "Please wait while we verify your identity..." : verificationState === "verified" ? "Your identity has been confirmed. Processing transaction..." : mobile.description}
                      </p>
                    </div>

                    {/* Main Action Button */}
                    {!showSuccess && !showDeclined && (
                      <button
                        onClick={mobile.main_action.type === "verify" ? handleVerifyIdentity : undefined}
                        disabled={verificationState !== "idle" || reportingFraud}
                        className={cn(
                          "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-all",
                          isAlert
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : isVerification
                              ? "bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-50"
                              : "bg-aktia-green text-white hover:bg-aktia-green-hover"
                        )}
                      >
                        {mobile.main_action.type === "call" && <Phone className="h-4 w-4" />}
                        {mobile.main_action.type === "verify" && <Fingerprint className="h-4 w-4" />}
                        {verificationState === "verifying" ? "Verifying..." : verificationState === "verified" ? "Verified!" : mobile.main_action.label}
                      </button>
                    )}

                    {/* Report Fraud Button - Only for verification view */}
                    {isVerification && !showSuccess && !showDeclined && verificationState === "idle" && !reportingFraud && (
                      <button
                        onClick={handleReportFraud}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/50 bg-red-500/10 py-3 font-semibold text-red-400 transition-all hover:bg-red-500/20"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        Report Suspicious Activity
                      </button>
                    )}

                    {showSuccess && (
                      <button
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-aktia-green py-3.5 font-semibold text-white transition-all hover:bg-aktia-green-hover"
                      >
                        View Details
                      </button>
                    )}
                    {showDeclined && (
                      <button
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-aktia-green py-3.5 font-semibold text-white transition-all hover:bg-aktia-green-hover"
                      >
                        Contact Support
                      </button>
                    )}

                    {/* Upsell Block */}
                    <div className="mt-4 rounded-xl border border-white/20 bg-white/10 p-4">
                      <h4 className="mb-1 text-sm font-semibold text-white">{mobile.upsell_block.title}</h4>
                      <p className="mb-3 text-xs leading-relaxed text-white/70">{mobile.upsell_block.text}</p>
                      <button className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white">
                        {mobile.upsell_block.cta}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/20 px-6 py-4">
                <div className="flex justify-around">
                  {["Home", "Cards", "Pay", "More"].map((item) => (
                    <div key={item} className="flex flex-col items-center gap-1">
                      <div className="h-5 w-5 rounded-full bg-white/20" />
                      <span className="text-[10px] text-white/60">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phone shadow */}
          <div className="absolute -bottom-4 left-1/2 h-4 w-3/4 -translate-x-1/2 rounded-full bg-black/30 blur-xl" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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
