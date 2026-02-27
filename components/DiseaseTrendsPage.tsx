"use client";

import { useState } from "react";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { growthTrendData, diseasePrevalenceData, regionOptions } from "@/lib/mockData";
import { TrendingUp, ChevronDown } from "lucide-react";

const COLORS = { Heart: "#ff4d4f", BP: "#7c3aed", Sugar: "#faad14", Stress: "#0052cc" };
const DISEASE_KEYS = ["Heart", "BP", "Sugar", "Stress"] as const;

// Generate forecast from existing data
const forecastData = [
    ...growthTrendData,
    { month: "Mar '26", Heart: 18200, BP: 31800, Sugar: 42100, Stress: 13900 },
    { month: "Apr '26", Heart: 19100, BP: 33200, Sugar: 44000, Stress: 14400 },
];

const heatmapRegions = ["Bengaluru", "Chennai", "Mumbai", "Hyderabad", "Delhi", "Ahmedabad"];
const heatmapData: Record<string, Record<string, number>> = {
    Bengaluru: { Heart: 4200, BP: 6800, Sugar: 7200, Stress: 3100 },
    Chennai: { Heart: 5100, BP: 7400, Sugar: 8900, Stress: 2800 },
    Mumbai: { Heart: 6300, BP: 8100, Sugar: 9500, Stress: 4200 },
    Hyderabad: { Heart: 3800, BP: 5900, Sugar: 7100, Stress: 2500 },
    Delhi: { Heart: 7200, BP: 9300, Sugar: 10200, Stress: 5100 },
    Ahmedabad: { Heart: 3200, BP: 5100, Sugar: 6300, Stress: 1900 },
};

function heatColor(val: number, disease: string): string {
    const maxes: Record<string, number> = { Heart: 7200, BP: 9300, Sugar: 10200, Stress: 5100 };
    const pct = val / maxes[disease];
    const colors: Record<string, [string, string]> = {
        Heart: ["#fff1f0", "#ff4d4f"],
        BP: ["#f5f0ff", "#7c3aed"],
        Sugar: ["#fffbe6", "#faad14"],
        Stress: ["#e6f0ff", "#0052cc"],
    };
    const [light, dark] = colors[disease];
    // Interpolate hex is complex; use opacity trick with dark colour
    const opacity = 0.15 + pct * 0.85;
    return `${dark}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`;
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl p-3 shadow-xl border text-xs" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
            <p className="font-bold mb-2" style={{ color: "#0a2540" }}>{label}</p>
            {payload.map((e: any) => (
                <div key={e.name} className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                    <span style={{ color: "#64748b" }}>{e.name}:</span>
                    <span className="font-semibold">{e.value.toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
}

const TIME_RANGES = ["7d", "30d", "90d", "1yr"] as const;

export default function DiseaseTrendsPage() {
    const [range, setRange] = useState<typeof TIME_RANGES[number]>("1yr");
    const [disease, setDisease] = useState("All");
    const [state, setState] = useState("All");
    const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set(DISEASE_KEYS));

    const toggleKey = (k: string) =>
        setActiveKeys(prev => { const s = new Set(prev); s.has(k) ? s.delete(k) : s.add(k); return s; });

    const chartData = range === "7d" ? forecastData.slice(-2) : range === "30d" ? forecastData.slice(-3) : range === "90d" ? forecastData.slice(-5) : forecastData;

    return (
        <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between" style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: "#0a2540" }}>Disease Trends</h1>
                    <p className="text-sm" style={{ color: "#64748b" }}>National chronic disease growth analysis & regional breakdown</p>
                </div>
                <div className="flex gap-2 items-center">
                    {/* Time range pills */}
                    {TIME_RANGES.map(r => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{
                                background: range === r ? "#0052cc" : "#f1f5f9",
                                color: range === r ? "#fff" : "#64748b",
                            }}
                        >
                            {r}
                        </button>
                    ))}
                    {/* State filter */}
                    <div className="relative ml-2">
                        <select
                            value={state}
                            onChange={e => setState(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border text-sm font-medium cursor-pointer outline-none"
                            style={{ borderColor: "#b3d1ff", background: "#e6f0ff", color: "#0052cc" }}
                        >
                            <option value="All">All States</option>
                            {regionOptions.states.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#0052cc" }} />
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Area chart — national trend */}
                <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold" style={{ color: "#0a2540" }}>National Chronic Disease Growth</h3>
                            <p className="text-xs" style={{ color: "#94a3b8" }}>Aggregate case count across all monitored regions</p>
                        </div>
                        {/* Legend toggles */}
                        <div className="flex gap-3">
                            {DISEASE_KEYS.map(k => (
                                <button
                                    key={k}
                                    onClick={() => toggleKey(k)}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all"
                                    style={{
                                        background: activeKeys.has(k) ? COLORS[k] + "18" : "#f8fafc",
                                        color: activeKeys.has(k) ? COLORS[k] : "#94a3b8",
                                        borderColor: activeKeys.has(k) ? COLORS[k] + "40" : "#e2e8f0",
                                        opacity: activeKeys.has(k) ? 1 : 0.5,
                                    }}
                                >
                                    <div className="w-2 h-2 rounded-full" style={{ background: activeKeys.has(k) ? COLORS[k] : "#cbd5e0" }} />
                                    {k}
                                </button>
                            ))}
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={chartData}>
                            <defs>
                                {DISEASE_KEYS.map(k => (
                                    <linearGradient key={k} id={`grad_${k}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS[k]} stopOpacity={0.25} />
                                        <stop offset="95%" stopColor={COLORS[k]} stopOpacity={0.02} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            {DISEASE_KEYS.filter(k => activeKeys.has(k)).map(k => (
                                <Area key={k} type="monotone" dataKey={k} stroke={COLORS[k]} strokeWidth={2} fill={`url(#grad_${k})`} dot={{ r: 3, fill: COLORS[k] }} />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Two column charts */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Bar — regional prevalence */}
                    <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
                        <h3 className="font-bold mb-1" style={{ color: "#0a2540" }}>Disease Prevalence by Region</h3>
                        <p className="text-xs mb-4" style={{ color: "#94a3b8" }}>Cases per monitored region</p>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={diseasePrevalenceData} barCategoryGap="25%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="region" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                {DISEASE_KEYS.filter(k => activeKeys.has(k)).map(k => (
                                    <Bar key={k} dataKey={k} fill={COLORS[k]} radius={[3, 3, 0, 0]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Heatmap */}
                    <div className="rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
                        <h3 className="font-bold mb-1" style={{ color: "#0a2540" }}>Regional Heatmap</h3>
                        <p className="text-xs mb-4" style={{ color: "#94a3b8" }}>Disease intensity per region — darker = higher load</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr>
                                        <th className="text-left py-1.5 pr-3 font-semibold" style={{ color: "#94a3b8" }}>Region</th>
                                        {DISEASE_KEYS.map(k => (
                                            <th key={k} className="text-center px-2 py-1.5 font-semibold" style={{ color: COLORS[k] }}>{k}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {heatmapRegions.map(r => (
                                        <tr key={r}>
                                            <td className="py-2 pr-3 font-medium" style={{ color: "#64748b" }}>{r}</td>
                                            {DISEASE_KEYS.map(k => (
                                                <td key={k} className="text-center px-2 py-1.5">
                                                    <div
                                                        className="rounded-lg px-2 py-1 font-semibold text-center"
                                                        style={{ background: heatColor(heatmapData[r][k], k), color: COLORS[k] }}
                                                    >
                                                        {(heatmapData[r][k] / 1000).toFixed(1)}k
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Growth rate cards */}
                <div className="grid grid-cols-4 gap-4">
                    {DISEASE_KEYS.map(k => {
                        const latest = forecastData[forecastData.length - 1][k];
                        const prev = forecastData[forecastData.length - 3][k];
                        const growth = (((latest - prev) / prev) * 100).toFixed(1);
                        return (
                            <div key={k} className="rounded-2xl border p-4" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-semibold" style={{ color: "#64748b" }}>{k === "BP" ? "Hypertension" : k === "Sugar" ? "Diabetes" : k}</p>
                                    <TrendingUp size={14} style={{ color: COLORS[k] }} />
                                </div>
                                <p className="text-2xl font-black" style={{ color: COLORS[k] }}>{(latest / 1000).toFixed(1)}k</p>
                                <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                                    <span className="font-semibold" style={{ color: "#52c41a" }}>+{growth}%</span> vs 3 months ago
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
