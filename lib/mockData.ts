/**
 * mockData.ts
 *
 * Type definitions + data loaders that read from the JSON data files in /data/.
 * To add/modify patients or admin stats, edit the JSON files directly — no TypeScript changes needed.
 */
import patientsJson from "@/data/patients.json";
import adminJson from "@/data/adminStats.json";

// ─── Types ───────────────────────────────────────────────────────────────────

export type RiskLevel = "High" | "Medium" | "Low";
export type DiseaseType = "Heart" | "BP" | "Sugar" | "Stress";

export interface ClinicalMetric {
  label: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  status: "normal" | "warning" | "critical";
}

export interface HistoryEntry {
  date: string;
  title: string;
  summary: string;
  riskLevel: RiskLevel;
  doctor: string;
}

export interface UploadedReport {
  filename: string;
  uploadedAt: string; // ISO date string
  extractedText: string;
  groqAnalysis: {
    summary: string;
    riskLevel: RiskLevel;
    riskReason: string;
    suggestedActions: string[];
    extractedMetrics: ClinicalMetric[];
  } | null;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  disease: DiseaseType;
  riskLevel: RiskLevel;
  phone: string;
  email: string;
  address: string;
  lastVisit: string;
  nextAppointment: string;
  assignedDoctor: string;
  profileImage: string;
  uploadedReports: UploadedReport[];
  clinicalMetrics: ClinicalMetric[];
  suggestedActions: string[];
  historyTimeline: HistoryEntry[];
  llmSummary: string;
}

// ─── Patient data (sourced from data/patients.json) ───────────────────────────

export const mockPatients: Patient[] = patientsJson as Patient[];

// ─── Admin data (sourced from data/adminStats.json) ──────────────────────────

export const regionOptions = adminJson.regionOptions as {
  states: string[];
  cities: Record<string, string[]>;
};
export const diseasePrevalenceData = adminJson.diseasePrevalenceData;
export const growthTrendData = adminJson.growthTrendData;
export const adminStats = adminJson.adminStats;
export const districtData = adminJson.districtData;
