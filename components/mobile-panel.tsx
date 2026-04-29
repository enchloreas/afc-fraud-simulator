"use client"

import { useEffect, useState } from "react"
import type { PanelRightMobile } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Shield, CheckCircle, Phone, ChevronRight, Wifi, Battery, Signal } from "lucide-react"

interface MobilePanelProps {
  mobile: PanelRightMobile | null
  isVisible: boolean
}

export function MobilePanel({ mobile, isVisible }: MobilePanelProps) {
  const [showContent, setShowContent] = useState(false)
  const [currentTime, setCurrentTime] = useState("")

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
    }
  }, [isVisible])

  const isAlert = mobile?.view_type === "SECURITY_ALERT_VIEW"

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 border-b border-slate-700 pb-3">
        <h2 className="text-lg font-semibold text-white">Aktia Mobile</h2>
        <p className="text-sm text-slate-400">Customer Notification</p>
      </div>

      {/* Phone Frame */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-full max-w-[280px]">
          {/* Phone outer frame */}
          <div className="overflow-hidden rounded-[2.5rem] border-[8px] border-slate-800 bg-slate-800 shadow-2xl">
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-3 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

            {/* Screen */}
            <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-[#002E6E]">
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                    <span className="text-sm font-bold text-[#002E6E]">A</span>
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
                          isAlert ? "bg-red-500/20" : "bg-green-500/20"
                        )}
                      >
                        {isAlert ? (
                          <Shield className="h-8 w-8 text-red-400" />
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
                          isAlert ? "text-red-400" : "text-white"
                        )}
                      >
                        {mobile.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/80">{mobile.description}</p>
                    </div>

                    {/* Main Action Button */}
                    <button
                      className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-all",
                        isAlert
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-white text-[#002E6E] hover:bg-white/90"
                      )}
                    >
                      {mobile.main_action.type === "call" && <Phone className="h-4 w-4" />}
                      {mobile.main_action.label}
                    </button>

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
              <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#001E4E] px-6 py-4">
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
