"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Clock, ChevronUp, Bell, Shield, TrendingUp, X } from "lucide-react";

type Severity = "Critical" | "High" | "Medium" | "Low";
type AlertStatus = "Active" | "Acknowledged" | "Resolved";

interface Alert {
    id: string;
    patientName: string;
    patientId: string;
    disease: string;
    riskLevel: string;
    type: string;
    message: string;
    severity: Severity;
    status: AlertStatus;
    doctor: string;
    time: string;
    timestamp: number;
}

const initialAlerts: Alert[] = [
    { id: "ALT-001", patientName: "Ravi Chandrasekaran", patientId: "PAT-005", disease: "Heart", riskLevel: "High", type: "Vital Sign", message: "SpO2 dropped to 93% — below critical threshold of 94%. Possible respiratory compromise.", severity: "Critical", status: "Active", doctor: "Dr. Priya Nair", time: "2 min ago", timestamp: 1 },
    { id: "ALT-002", patientName: "Venkatesh Iyer", patientId: "PAT-003", disease: "BP", riskLevel: "High", type: "Hypertensive Crisis", message: "Blood pressure 168/104 mmHg — Stage 2 hypertension with risk of end-organ damage.", severity: "Critical", status: "Active", doctor: "Dr. Priya Nair", time: "8 min ago", timestamp: 2 },
    { id: "ALT-003", patientName: "Arjun Sharma", patientId: "PAT-001", disease: "Heart", riskLevel: "High", type: "Cardiac Alert", message: "Troponin I elevated at 0.12 ng/mL — active myocardial injury suspected. Echo overdue.", severity: "High", status: "Acknowledged", doctor: "Dr. Priya Nair", time: "25 min ago", timestamp: 3 },
    { id: "ALT-004", patientName: "Meera Krishnamurthy", patientId: "PAT-002", disease: "Sugar", riskLevel: "Medium", type: "Glucose Alert", message: "Post-prandial glucose at 210 mg/dL — significantly above 180 mg/dL target.", severity: "Medium", status: "Active", doctor: "Dr. Priya Nair", time: "1 hr ago", timestamp: 4 },
    { id: "ALT-005", patientName: "Arjun Sharma", patientId: "PAT-001", disease: "Heart", riskLevel: "High", type: "Missed Medication", message: "Metoprolol dose not recorded today. Patient may have missed dose.", severity: "Medium", status: "Active", doctor: "Dr. Priya Nair", time: "2 hr ago", timestamp: 5 },
    { id: "ALT-006", patientName: "Lakshmi Patel", patientId: "PAT-004", disease: "Stress", riskLevel: "Low", type: "Wellness Alert", message: "GAD-7 anxiety score increased to 14 — moderate anxiety. CBT session recommended.", severity: "Low", status: "Acknowledged", doctor: "Dr. Priya Nair", time: "4 hr ago", timestamp: 6 },
    { id: "ALT-007", patientName: "Venkatesh Iyer", patientId: "PAT-003", disease: "BP", riskLevel: "High", type: "Lab Result", message: "Potassium level 3.4 mEq/L — below normal range. Possible diuretic-induced hypokalemia.", severity: "High", status: "Resolved", doctor: "Dr. Priya Nair", time: "Yesterday", timestamp: 7 },
    { id: "ALT-008", patientName: "Ravi Chandrasekaran", patientId: "PAT-005", disease: "Heart", riskLevel: "High", type: "BNP Elevation", message: "BNP at 520 pg/mL — strongly suggests acute heart failure decompensation.", severity: "Critical", status: "Active", doctor: "Dr. Priya Nair", time: "10 min ago", timestamp: 8 },
];

const severityConfig: Record<Severity, { color: string; bg: string; border: string }> = {
    Critical: { color: "#fff", bg: "#ff4d4f", border: "#ff4d4f" },
    High: { color: "#fff", bg: "#fa8c16", border: "#fa8c16" },
    Medium: { color: "#faad14", bg: "#fffbe6", border: "#ffd666" },
    Low: { color: "#52c41a", bg: "#f6ffed", border: "#b7eb8f" },
};
const statusConfig: Record<AlertStatus, { color: string; bg: string; label: string }> = {
    Active: { color: "#ff4d4f", bg: "#fff1f0", label: "● Active" },
    Acknowledged: { color: "#faad14", bg: "#fffbe6", label: "◐ Acknowledged" },
    Resolved: { color: "#52c41a", bg: "#f6ffed", label: "✓ Resolved" },
};

type TabKey = "all" | "critical" | "pending" | "resolved";

export default function AlertManagementPage() {
    const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
    const [tab, setTab] = useState<TabKey>("all");
    const [selected, setSelected] = useState<string | null>(null);

    const activeTab = (key: TabKey) => {
        if (key === "all") return alerts;
        if (key === "critical") return alerts.filter(a => a.severity === "Critical");
        if (key === "pending") return alerts.filter(a => a.status === "Active" || a.status === "Acknowledged");
        return alerts.filter(a => a.status === "Resolved");
    };

    const update = (id: string, status: AlertStatus) =>
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));

    const displayed = activeTab(tab).sort((a, b) => a.timestamp - b.timestamp);

    const stats = {
        total: alerts.length,
        critical: alerts.filter(a => a.severity === "Critical" && a.status !== "Resolved").length,
        resolved: alerts.filter(a => a.status === "Resolved").length,
        pending: alerts.filter(a => a.status === "Active").length,
    };

    return (
        <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between" style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: "#0a2540" }}>Alert Management</h1>
                    <p className="text-sm" style={{ color: "#64748b" }}>Patient safety alerts · Triage, acknowledge, and resolve</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold animate-pulse" style={{ background: "#fff1f0", color: "#ff4d4f", border: "1px solid #ffccc7" }}>
                    <Bell size={12} /> {stats.critical} Critical Unresolved
                </div>
            </div>

            <div className="p-6 space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: "Total Alerts", value: stats.total, color: "#0052cc", bg: "#e6f0ff" },
                        { label: "Critical Active", value: stats.critical, color: "#ff4d4f", bg: "#fff1f0" },
                        { label: "Pending Review", value: stats.pending, color: "#faad14", bg: "#fffbe6" },
                        { label: "Resolved Today", value: stats.resolved, color: "#52c41a", bg: "#f6ffed" },
                    ].map(s => (
                        <div key={s.label} className="rounded-2xl p-4 border" style={{ background: s.bg, borderColor: s.color + "33" }}>
                            <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
                            <p className="text-xs font-medium mt-1" style={{ color: "#64748b" }}>{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tab filters */}
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#f1f5f9", width: "fit-content" }}>
                    {(["all", "critical", "pending", "resolved"] as TabKey[]).map(t => {
                        const count = activeTab(t).length;
                        return (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all flex items-center gap-2"
                                style={{
                                    background: tab === t ? "#fff" : "transparent",
                                    color: tab === t ? "#0052cc" : "#64748b",
                                    boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                                }}
                            >
                                {t}
                                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: tab === t ? "#e6f0ff" : "#e2e8f0", color: tab === t ? "#0052cc" : "#94a3b8" }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Alert cards */}
                <div className="space-y-3">
                    {displayed.map(alert => {
                        const sc = severityConfig[alert.severity];
                        const stc = statusConfig[alert.status];
                        const isSelected = selected === alert.id;
                        return (
                            <div
                                key={alert.id}
                                className="rounded-2xl border overflow-hidden transition-all"
                                style={{ borderColor: alert.status === "Resolved" ? "#e2e8f0" : sc.border + "60" }}
                            >
                                <div
                                    className="px-5 py-4 cursor-pointer"
                                    style={{ background: alert.status === "Resolved" ? "#fafafa" : "#fff" }}
                                    onClick={() => setSelected(isSelected ? null : alert.id)}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Severity badge */}
                                        <div className="mt-0.5">
                                            <span
                                                className="text-xs px-2.5 py-1 rounded-full font-black"
                                                style={{
                                                    background: alert.severity === "Critical" || alert.severity === "High" ? sc.bg : sc.bg,
                                                    color: alert.severity === "Critical" || alert.severity === "High" ? sc.color : sc.color,
                                                    border: `1px solid ${sc.border}40`,
                                                }}
                                            >
                                                {alert.severity}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <p className="font-bold text-sm" style={{ color: "#0a2540" }}>{alert.patientName}</p>
                                                <span className="text-xs" style={{ color: "#94a3b8" }}>{alert.patientId}</span>
                                                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: stc.bg, color: stc.color }}>
                                                    {stc.label}
                                                </span>
                                            </div>
                                            <p className="text-xs font-medium mt-0.5" style={{ color: "#0052cc" }}>{alert.type}</p>
                                            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#64748b" }}>{alert.message}</p>
                                            <p className="text-xs mt-1.5" style={{ color: "#94a3b8" }}>
                                                <Clock size={10} className="inline mr-1" />{alert.time} · {alert.doctor}
                                            </p>
                                        </div>

                                        {/* Quick actions */}
                                        <div className="flex gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                                            {alert.status === "Active" && (
                                                <button
                                                    onClick={() => update(alert.id, "Acknowledged")}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                                                    style={{ background: "#fffbe6", color: "#faad14", border: "1px solid #ffd666" }}
                                                >
                                                    Acknowledge
                                                </button>
                                            )}
                                            {alert.status !== "Resolved" && (
                                                <button
                                                    onClick={() => update(alert.id, "Resolved")}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                                                    style={{ background: "#f6ffed", color: "#52c41a", border: "1px solid #b7eb8f" }}
                                                >
                                                    Resolve
                                                </button>
                                            )}
                                            {alert.status === "Resolved" && (
                                                <button
                                                    onClick={() => update(alert.id, "Active")}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                                                    style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}
                                                >
                                                    Reopen
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Escalation panel */}
                                {isSelected && alert.status !== "Resolved" && (
                                    <div className="px-5 py-3 border-t fade-in" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
                                        <div className="flex gap-3 items-center">
                                            <p className="text-xs font-semibold" style={{ color: "#64748b" }}>Escalate to:</p>
                                            {["Specialist", "Head of Dept", "Emergency"].map(el => (
                                                <button
                                                    key={el}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-red-50"
                                                    style={{ borderColor: "#ffccc7", color: "#ff4d4f" }}
                                                >
                                                    {el}
                                                </button>
                                            ))}
                                            <button className="ml-auto text-xs" style={{ color: "#94a3b8" }} onClick={() => setSelected(null)}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
