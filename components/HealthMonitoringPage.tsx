"use client";

import { useState } from "react";
import { mockPatients } from "@/lib/mockData";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { Activity, Heart, Droplets, Wind, AlertTriangle, Shield, ChevronRight } from "lucide-react";

// Generate sparkline-like mock readings per patient
function generateReadings(base: number, count = 12, variance = 8) {
    return Array.from({ length: count }, (_, i) => ({
        t: i,
        v: Math.max(base - variance, Math.min(base + variance, base + (Math.random() - 0.5) * variance * 2)),
    }));
}

const alertFeed = [
    { id: 1, patient: "Ravi Chandrasekaran", metric: "SpO2", value: "93%", threshold: "< 94%", severity: "Critical", time: "2 min ago", patientId: "PAT-005" },
    { id: 2, patient: "Venkatesh Iyer", metric: "Systolic BP", value: "168 mmHg", threshold: "> 160 mmHg", severity: "Critical", time: "8 min ago", patientId: "PAT-003" },
    { id: 3, patient: "Arjun Sharma", metric: "Heart Rate", value: "94 bpm", threshold: "> 90 bpm", severity: "Warning", time: "15 min ago", patientId: "PAT-001" },
    { id: 4, patient: "Meera Krishnamurthy", metric: "Post-prandial Glucose", value: "210 mg/dL", threshold: "> 200 mg/dL", severity: "Warning", time: "1 hr ago", patientId: "PAT-002" },
    { id: 5, patient: "Lakshmi Patel", metric: "Cortisol", value: "22.4 µg/dL", threshold: "> 22 µg/dL", severity: "Info", time: "3 hr ago", patientId: "PAT-004" },
];

const monitoredPatients = mockPatients.filter(p => p.riskLevel === "High" || p.riskLevel === "Medium").slice(0, 4);

const metricIcons: Record<string, React.ReactNode> = {
    "Heart Rate": <Heart size={14} />, "SpO2": <Wind size={14} />, "Systolic BP": <Activity size={14} />, "HbA1c": <Droplets size={14} />,
};

function VitalsCard({ patient }: { patient: typeof mockPatients[0] }) {
    const topMetrics = patient.clinicalMetrics.slice(0, 3);
    const baseValues = topMetrics.map(m => parseFloat(m.value.split("/")[0]) || 0);
    const statusColor: Record<string, string> = { critical: "#ff4d4f", warning: "#faad14", normal: "#52c41a" };

    return (
        <div className="rounded-2xl border p-4" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
            {/* Patient header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{
                            background: patient.riskLevel === "High" ? "#fff1f0" : "#fffbe6",
                            color: patient.riskLevel === "High" ? "#ff4d4f" : "#faad14",
                        }}
                    >
                        {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                        <p className="text-sm font-bold" style={{ color: "#0a2540" }}>{patient.name}</p>
                        <p className="text-xs" style={{ color: "#94a3b8" }}>{patient.id} · {patient.disease}</p>
                    </div>
                </div>
                <span
                    className="text-xs px-2 py-1 rounded-full font-bold"
                    style={{
                        background: patient.riskLevel === "High" ? "#fff1f0" : "#fffbe6",
                        color: patient.riskLevel === "High" ? "#ff4d4f" : "#faad14",
                    }}
                >
                    {patient.riskLevel} Risk
                </span>
            </div>

            {/* Metrics with sparklines */}
            <div className="space-y-3">
                {topMetrics.map((m, i) => {
                    const data = generateReadings(baseValues[i]);
                    const sc = statusColor[m.status];
                    return (
                        <div key={m.label} className="flex items-center gap-3">
                            <div className="w-28 shrink-0">
                                <p className="text-xs" style={{ color: "#64748b" }}>{m.label}</p>
                                <p className="text-base font-black" style={{ color: sc }}>{m.value}</p>
                                <p className="text-xs" style={{ color: "#94a3b8" }}>{m.unit}</p>
                            </div>
                            <div className="flex-1 h-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <Line type="monotone" dataKey="v" stroke={sc} strokeWidth={1.5} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: sc, boxShadow: `0 0 6px ${sc}` }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function HealthMonitoringPage() {
    const [thresholds, setThresholds] = useState({
        heartRate: 90,
        systolicBP: 140,
        spo2: 95,
        glucose: 180,
    });

    return (
        <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between" style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: "#0a2540" }}>Health Monitoring</h1>
                    <p className="text-sm" style={{ color: "#64748b" }}>Live vitals & real-time alert feed for your patients</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: "#f6ffed", color: "#52c41a", border: "1px solid #b7eb8f" }}>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#52c41a" }} />
                    Live Monitoring Active
                </div>
            </div>

            <div className="p-6 flex gap-6">
                {/* Left — vitals grid */}
                <div className="flex-1 space-y-4">
                    <h2 className="text-sm font-bold" style={{ color: "#0a2540" }}>Patient Vitals — Real-time</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {monitoredPatients.map(p => <VitalsCard key={p.id} patient={p} />)}
                    </div>

                    {/* Threshold Settings */}
                    <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
                        <div className="flex items-center gap-2 mb-4">
                            <Shield size={16} style={{ color: "#0052cc" }} />
                            <h3 className="text-sm font-bold" style={{ color: "#0a2540" }}>Alert Thresholds</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { key: "heartRate" as const, label: "Heart Rate", unit: "bpm", min: 60, max: 120 },
                                { key: "systolicBP" as const, label: "Systolic BP", unit: "mmHg", min: 100, max: 180 },
                                { key: "spo2" as const, label: "Min SpO2", unit: "%", min: 88, max: 99 },
                                { key: "glucose" as const, label: "Post-prandial Glucose", unit: "mg/dL", min: 140, max: 250 },
                            ].map(t => (
                                <div key={t.key}>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-xs font-semibold" style={{ color: "#374151" }}>{t.label}</label>
                                        <span className="text-xs font-bold" style={{ color: "#0052cc" }}>{thresholds[t.key]} {t.unit}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={t.min}
                                        max={t.max}
                                        value={thresholds[t.key]}
                                        onChange={e => setThresholds(prev => ({ ...prev, [t.key]: +e.target.value }))}
                                        className="w-full accent-blue-600"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right — Alert feed */}
                <div className="w-80 shrink-0">
                    <div className="rounded-2xl border overflow-hidden" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
                        <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#0a2540" }}>
                            <AlertTriangle size={14} className="text-red-400" />
                            <p className="text-sm font-bold text-white">Alert Feed</p>
                            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "#ff4d4f", color: "#fff" }}>
                                {alertFeed.filter(a => a.severity === "Critical").length} Critical
                            </span>
                        </div>
                        <div className="divide-y" style={{ borderColor: "#e2e8f0" }}>
                            {alertFeed.map(alert => (
                                <div key={alert.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex items-start justify-between mb-1">
                                        <p className="text-xs font-semibold" style={{ color: "#0a2540" }}>{alert.patient}</p>
                                        <span
                                            className="text-xs px-1.5 py-0.5 rounded font-bold"
                                            style={{
                                                background: alert.severity === "Critical" ? "#ff4d4f" : alert.severity === "Warning" ? "#faad14" : "#94a3b8",
                                                color: "#fff",
                                            }}
                                        >
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <p className="text-xs" style={{ color: "#64748b" }}>
                                        <span className="font-medium">{alert.metric}:</span> <span className="font-bold" style={{ color: "#ff4d4f" }}>{alert.value}</span>
                                        <span> (threshold {alert.threshold})</span>
                                    </p>
                                    <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>{alert.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
