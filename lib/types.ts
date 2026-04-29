// AFC Fraud Simulator Types

export interface TransactionPayload {
  transaction_id: string
  terminal_id: string
  merchant_name: string
  merchant_category_code: string
  amount: number
  currency: string
  entry_mode: "chip" | "contactless" | "magnetic_stripe" | "manual"
  timestamp: string
  current_location: {
    city: string
    country: string
    lat: number
    lng: number
  }
  last_location: {
    city: string
    country: string
    lat: number
    lng: number
    timestamp: string
  }
  card_present: boolean
  encrypted_blob_sample: string
  device_info: {
    terminal_type: string
    firmware_version: string
    network_id: string
  }
}

export interface ReasoningStep {
  id: number
  text: string
  status: "pending" | "processing" | "complete"
  result?: "pass" | "fail" | "warning"
}

export interface PanelCenterReasoning {
  steps: ReasoningStep[]
  risk_score: number
  verdict_color: "green" | "yellow" | "red"
}

export interface UpsellBlock {
  title: string
  text: string
  cta: string
}

export interface MainAction {
  label: string
  type: "call" | "action"
}

export interface PanelRightMobile {
  view_type: "SUCCESS_VIEW" | "SECURITY_ALERT_VIEW"
  title: string
  description: string
  main_action: MainAction
  upsell_block: UpsellBlock
}

export interface SimulatorOutput {
  panel_left_json: TransactionPayload
  panel_center_reasoning: PanelCenterReasoning
  panel_right_mobile: PanelRightMobile
}

export type TerminalState =
  | "idle"
  | "insert_card"
  | "reading_card"
  | "authorizing"
  | "processing"
  | "approved"
  | "declined"

export interface Scenario {
  id: string
  name: string
  description: string
  type: "legitimate" | "fraud"
}
