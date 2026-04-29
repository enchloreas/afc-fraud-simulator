import type { TransactionPayload, SimulatorOutput, Scenario } from "./types"

export const scenarios: Scenario[] = [
  {
    id: "legitimate_local",
    name: "Local Purchase",
    description: "Normal purchase at a local Helsinki store",
    type: "legitimate",
  },
  {
    id: "legitimate_travel",
    name: "Known Travel",
    description: "Purchase in Thailand with confirmed flight booking",
    type: "legitimate",
  },
  {
    id: "impossible_travel",
    name: "Impossible Travel",
    description: "Helsinki to Thailand in 2 hours - no flight history",
    type: "fraud",
  },
  {
    id: "high_risk_merchant",
    name: "High Risk Merchant",
    description: "Large purchase at suspicious online merchant",
    type: "fraud",
  },
]

function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

function generateEncryptedBlob(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  let result = ""
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateScenarioData(scenarioId: string): SimulatorOutput {
  const now = new Date()

  switch (scenarioId) {
    case "legitimate_local":
      return {
        panel_left_json: {
          transaction_id: generateTransactionId(),
          terminal_id: "POS-HEL-001-A7",
          merchant_name: "Stockmann Helsinki",
          merchant_category_code: "5311",
          amount: 89.5,
          currency: "EUR",
          entry_mode: "contactless",
          timestamp: now.toISOString(),
          current_location: {
            city: "Helsinki",
            country: "Finland",
            lat: 60.1699,
            lng: 24.9384,
          },
          last_location: {
            city: "Helsinki",
            country: "Finland",
            lat: 60.1695,
            lng: 24.9354,
            timestamp: new Date(now.getTime() - 3600000).toISOString(),
          },
          card_present: true,
          encrypted_blob_sample: generateEncryptedBlob(),
          device_info: {
            terminal_type: "Verifone VX520",
            firmware_version: "4.2.1",
            network_id: "NETS-FI-001",
          },
        },
        panel_center_reasoning: {
          steps: [
            { id: 1, text: "Extracting transaction metadata...", status: "complete", result: "pass" },
            { id: 2, text: "Location Check: Helsinki → Helsinki", status: "complete", result: "pass" },
            { id: 3, text: "Time Delta: 1 hour since last transaction", status: "complete", result: "pass" },
            { id: 4, text: "Distance: 0.3 km - Within normal range", status: "complete", result: "pass" },
            { id: 5, text: "Merchant Category: Department Store (Low Risk)", status: "complete", result: "pass" },
            { id: 6, text: "Amount: €89.50 - Within typical spending pattern", status: "complete", result: "pass" },
            { id: 7, text: "Device Verification: Known terminal, valid firmware", status: "complete", result: "pass" },
            { id: 8, text: "Risk Score Calculation: 12/100", status: "complete", result: "pass" },
          ],
          risk_score: 12,
          verdict_color: "green",
        },
        panel_right_mobile: {
          view_type: "SUCCESS_VIEW",
          title: "Payment Approved",
          description: "€89.50 at Stockmann Helsinki",
          main_action: { label: "View Details", type: "action" },
          upsell_block: {
            title: "Aktia Cashback",
            text: "You earned €0.90 cashback on this purchase! Upgrade to Aktia Gold for 2% on all shopping.",
            cta: "Learn More",
          },
        },
      }

    case "legitimate_travel":
      return {
        panel_left_json: {
          transaction_id: generateTransactionId(),
          terminal_id: "POS-BKK-CTW-042",
          merchant_name: "Central World Bangkok",
          merchant_category_code: "5311",
          amount: 4250.0,
          currency: "THB",
          entry_mode: "chip",
          timestamp: now.toISOString(),
          current_location: {
            city: "Bangkok",
            country: "Thailand",
            lat: 13.7563,
            lng: 100.5018,
          },
          last_location: {
            city: "Helsinki",
            country: "Finland",
            lat: 60.1699,
            lng: 24.9384,
            timestamp: new Date(now.getTime() - 43200000).toISOString(),
          },
          card_present: true,
          encrypted_blob_sample: generateEncryptedBlob(),
          device_info: {
            terminal_type: "Ingenico Move5000",
            firmware_version: "3.8.2",
            network_id: "VISA-TH-NET",
          },
        },
        panel_center_reasoning: {
          steps: [
            { id: 1, text: "Extracting transaction metadata...", status: "complete", result: "pass" },
            { id: 2, text: "Location Check: Helsinki → Bangkok", status: "complete", result: "warning" },
            { id: 3, text: "Time Delta: 12 hours since last transaction", status: "complete", result: "warning" },
            { id: 4, text: "Distance: 8,317 km - International travel detected", status: "complete", result: "warning" },
            { id: 5, text: "Travel Verification: Checking booking systems...", status: "complete", result: "pass" },
            { id: 6, text: "✓ Flight AY089 HEL→BKK confirmed (departed 10h ago)", status: "complete", result: "pass" },
            { id: 7, text: "✓ Device GPS: User phone located in Bangkok", status: "complete", result: "pass" },
            { id: 8, text: "Amount: ฿4,250 (~€110) - Reasonable for travel", status: "complete", result: "pass" },
            { id: 9, text: "Risk Score Calculation: 28/100", status: "complete", result: "pass" },
          ],
          risk_score: 28,
          verdict_color: "green",
        },
        panel_right_mobile: {
          view_type: "SUCCESS_VIEW",
          title: "Payment Approved",
          description: "฿4,250 at Central World Bangkok",
          main_action: { label: "View Details", type: "action" },
          upsell_block: {
            title: "Traveling? Get Protected!",
            text: "Add Aktia Travel Insurance for just €4.90/day. Covers medical, theft, and trip cancellation.",
            cta: "Add Insurance",
          },
        },
      }

    case "impossible_travel":
      return {
        panel_left_json: {
          transaction_id: generateTransactionId(),
          terminal_id: "POS-BKK-PTY-019",
          merchant_name: "Patpong Night Market",
          merchant_category_code: "5999",
          amount: 15800.0,
          currency: "THB",
          entry_mode: "magnetic_stripe",
          timestamp: now.toISOString(),
          current_location: {
            city: "Bangkok",
            country: "Thailand",
            lat: 13.7294,
            lng: 100.5341,
          },
          last_location: {
            city: "Helsinki",
            country: "Finland",
            lat: 60.1699,
            lng: 24.9384,
            timestamp: new Date(now.getTime() - 7200000).toISOString(),
          },
          card_present: true,
          encrypted_blob_sample: generateEncryptedBlob(),
          device_info: {
            terminal_type: "Unknown Model",
            firmware_version: "2.1.0",
            network_id: "LOCAL-TH-009",
          },
        },
        panel_center_reasoning: {
          steps: [
            { id: 1, text: "Extracting transaction metadata...", status: "complete", result: "pass" },
            { id: 2, text: "Location Check: Helsinki → Bangkok", status: "complete", result: "fail" },
            { id: 3, text: "Time Delta: 2 hours since last transaction", status: "complete", result: "fail" },
            { id: 4, text: "⚠️ IMPOSSIBLE SPEED DETECTED", status: "complete", result: "fail" },
            { id: 5, text: "Distance: 8,317 km in 2 hours = 4,158 km/h", status: "complete", result: "fail" },
            { id: 6, text: "Travel Verification: Checking booking systems...", status: "complete", result: "fail" },
            { id: 7, text: "✗ NO FLIGHT HISTORY FOUND", status: "complete", result: "fail" },
            { id: 8, text: "✗ Device GPS: User phone still in Helsinki", status: "complete", result: "fail" },
            { id: 9, text: "Entry Mode: Magnetic stripe (high fraud risk)", status: "complete", result: "fail" },
            { id: 10, text: "Terminal: Unknown model, outdated firmware", status: "complete", result: "fail" },
            { id: 11, text: "Risk Score Calculation: 97/100", status: "complete", result: "fail" },
            { id: 12, text: "VERDICT: BLOCK TRANSACTION", status: "complete", result: "fail" },
          ],
          risk_score: 97,
          verdict_color: "red",
        },
        panel_right_mobile: {
          view_type: "SECURITY_ALERT_VIEW",
          title: "Card Blocked",
          description: "We detected suspicious activity and blocked your card to protect your assets.",
          main_action: { label: "Call Security Team", type: "call" },
          upsell_block: {
            title: "Stay Protected",
            text: "Enable Aktia SecureShield for real-time fraud alerts and instant card freeze from your phone.",
            cta: "Activate SecureShield",
          },
        },
      }

    case "high_risk_merchant":
      return {
        panel_left_json: {
          transaction_id: generateTransactionId(),
          terminal_id: "VTERM-CRYPTO-X99",
          merchant_name: "CryptoGems Exchange",
          merchant_category_code: "6051",
          amount: 4999.0,
          currency: "EUR",
          entry_mode: "manual",
          timestamp: now.toISOString(),
          current_location: {
            city: "Unknown",
            country: "Seychelles",
            lat: -4.6796,
            lng: 55.492,
          },
          last_location: {
            city: "Helsinki",
            country: "Finland",
            lat: 60.1699,
            lng: 24.9384,
            timestamp: new Date(now.getTime() - 1800000).toISOString(),
          },
          card_present: false,
          encrypted_blob_sample: generateEncryptedBlob(),
          device_info: {
            terminal_type: "Virtual Terminal",
            firmware_version: "1.0.0",
            network_id: "OFFSHORE-NET",
          },
        },
        panel_center_reasoning: {
          steps: [
            { id: 1, text: "Extracting transaction metadata...", status: "complete", result: "pass" },
            { id: 2, text: "Card Not Present: Online transaction", status: "complete", result: "warning" },
            { id: 3, text: "Merchant Category: Cryptocurrency (High Risk)", status: "complete", result: "fail" },
            { id: 4, text: "Amount: €4,999 - Just below reporting threshold", status: "complete", result: "fail" },
            { id: 5, text: "⚠️ STRUCTURING PATTERN DETECTED", status: "complete", result: "fail" },
            { id: 6, text: "Merchant Location: Offshore jurisdiction", status: "complete", result: "fail" },
            { id: 7, text: "Entry Mode: Manual entry (no card verification)", status: "complete", result: "fail" },
            { id: 8, text: "Customer History: No prior crypto purchases", status: "complete", result: "fail" },
            { id: 9, text: "Risk Score Calculation: 89/100", status: "complete", result: "fail" },
            { id: 10, text: "VERDICT: BLOCK & FLAG FOR REVIEW", status: "complete", result: "fail" },
          ],
          risk_score: 89,
          verdict_color: "red",
        },
        panel_right_mobile: {
          view_type: "SECURITY_ALERT_VIEW",
          title: "Transaction Blocked",
          description: "This transaction was blocked due to unusual activity. Your card remains secure.",
          main_action: { label: "Verify Identity", type: "action" },
          upsell_block: {
            title: "Interested in Crypto?",
            text: "Invest safely with Aktia Crypto through our regulated platform. Start with as little as €10.",
            cta: "Explore Aktia Crypto",
          },
        },
      }

    default:
      return generateScenarioData("legitimate_local")
  }
}
