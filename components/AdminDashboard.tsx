"use client";

import { useState } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    diseasePrevalenceData,
    growthTrendData,
    adminStats,
    districtData,
    regionOptions,
} from "@/lib/mockData";
import {
    Users,
    AlertTriangle,
    Stethoscope,
    MapPin,
    TrendingUp,
    AlertCircle,
    ChevronDown,
    Activity,
    RefreshCw,
} from "lucide-react";

const COLORS = {
    Heart: "#ff4d4f",
    BP: "#7c3aed",
    Sugar: "#faad14",
    Stress: "#0052cc",
};

function StatCard({
    icon,
    label,
    value,
    change,
    cardClass,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    change: string;
    cardClass: string;
}) {
    return (
        <div className={`${cardClass} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden`}>
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.2)" }}>
                        {icon}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.2)" }}>
                        {change}
                    </span>
                </div>
                <p className="text-3xl font-black">{value}</p>
                <p className="text-sm text-white/80 mt-1">{label}</p>
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div
                className="rounded-xl p-3 shadow-xl border text-xs"
                style={{ background: "#fff", borderColor: "#e2e8f0" }}
            >
                <p className="font-bold mb-2" style={{ color: "#0a2540" }}>{label}</p>
                {payload.map((entry: any) => (
                    <div key={entry.name} className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                        <span style={{ color: "#64748b" }}>{entry.name}:</span>
                        <span className="font-semibold" style={{ color: "#0a2540" }}>
                            {entry.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
}

export default function AdminDashboard() {
    const [selectedState, setSelectedState] = useState("Karnataka");
    const [selectedCity, setSelectedCity] = useState("Bengaluru");
    const [lastUpdated] = useState("02 Feb 2026, 14:35 IST");

    const cities = regionOptions.cities[selectedState as keyof typeof regionOptions.cities] || [];

    return (
        <div className="h-full overflow-y-auto">
            {/* Header */}
            <div
                className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between"
                style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}
            >
                <div>
                    <h1 className="text-xl font-bold" style={{ color: "#0a2540" }}>
                        Government Health Analytics
                    </h1>
                    <p className="text-sm" style={{ color: "#64748b" }}>
                        Regional Disease Surveillance · National Chronic Disease Monitoring System
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                        style={{ background: "#f1f5f9", color: "#64748b" }}
                    >
                        <RefreshCw size={12} />
                        Updated: {lastUpdated}
                    </div>
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold animate-pulse"
                        style={{ background: "#fff1f0", color: "#ff4d4f", border: "1px solid #ffccc7" }}
                    >
                        <AlertCircle size={12} />
                        {adminStats.criticalRegions} Regions Critical
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-4 gap-4">
                    <StatCard
                        icon={<Users size={20} />}
                        label="Total Patients Monitored"
                        value={adminStats.totalPatients.toLocaleString("en-IN")}
                        change="+12.4%"
                        cardClass="stat-card-blue"
                    />
                    <StatCard
                        icon={<AlertTriangle size={20} />}
                        label="High-Risk Alerts Today"
                        value={adminStats.highRiskAlertsToday.toString()}
                        change="+28 today"
                        cardClass="stat-card-red"
                    />
                    <StatCard
                        icon={<Stethoscope size={20} />}
                        label="Active Doctors"
                        value={adminStats.activeDoctors.toLocaleString("en-IN")}
                        change="+45 new"
                        cardClass="stat-card-green"
                    />
                    <StatCard
                        icon={<Activity size={20} />}
                        label="Critical Regions"
                        value={adminStats.criticalRegions.toString()}
                        change="↑ 2 from last wk"
                        cardClass="stat-card-purple"
                    />
                </div>

                {/* Geo-Analytics Region Selector */}
                <div
                    className="rounded-2xl p-5 border"
                    style={{ background: "#fff", borderColor: "#e2e8f0" }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <MapPin size={18} style={{ color: "#0052cc" }} />
                            <h2 className="text-base font-bold" style={{ color: "#0a2540" }}>
                                Regional Health Insights
                            </h2>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <select
                                    value={selectedState}
                                    onChange={(e) => {
                                        setSelectedState(e.target.value);
                                        const firstCity = regionOptions.cities[e.target.value as keyof typeof regionOptions.cities]?.[0] || "";
                                        setSelectedCity(firstCity);
                                    }}
                                    className="appearance-none pr-8 pl-3 py-2 text-sm rounded-xl border cursor-pointer outline-none font-medium"
                                    style={{ borderColor: "#b3d1ff", background: "#e6f0ff", color: "#0052cc" }}
                                >
                                    {regionOptions.states.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#0052cc" }} />
                            </div>
                            <div className="relative">
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="appearance-none pr-8 pl-3 py-2 text-sm rounded-xl border cursor-pointer outline-none font-medium"
                                    style={{ borderColor: "#b3d1ff", background: "#e6f0ff", color: "#0052cc" }}
                                >
                                    {cities.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#0052cc" }} />
                            </div>
                        </div>
                    </div>

                    {/* District Table */}
                    <div className="overflow-hidden rounded-xl border" style={{ borderColor: "#e2e8f0" }}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ background: "#f8fafc" }}>
                                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#64748b" }}>District</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: "#64748b" }}>Total Patients</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: "#64748b" }}>High Risk</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: "#64748b" }}>Growth</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: "#64748b" }}>Risk Ratio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {districtData.map((d, i) => {
                                    const ratio = ((d.highRisk / d.patients) * 100).toFixed(1);
                                    return (
                                        <tr
                                            key={d.district}
                                            style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderTop: "1px solid #e2e8f0" }}
                                            className="hover:bg-blue-50 transition-colors"
                                        >
                                            <td className="px-4 py-3 font-medium" style={{ color: "#0a2540" }}>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ background: "#0052cc" }} />
                                                    {d.district}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium" style={{ color: "#0a2540" }}>
                                                {d.patients.toLocaleString("en-IN")}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="font-semibold" style={{ color: "#ff4d4f" }}>{d.highRisk.toLocaleString("en-IN")}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span
                                                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                                    style={{ background: "#f6ffed", color: "#52c41a" }}
                                                >
                                                    <TrendingUp size={10} className="inline mr-1" />
                                                    {d.growth}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "#e2e8f0" }}>
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{
                                                                width: `${ratio}%`,
                                                                background: parseFloat(ratio) > 14 ? "#ff4d4f" : "#faad14",
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs" style={{ color: "#64748b" }}>{ratio}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Bar Chart */}
                    <div
                        className="rounded-2xl p-5 border"
                        style={{ background: "#fff", borderColor: "#e2e8f0" }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-sm" style={{ color: "#0a2540" }}>
                                    Disease Prevalence by Region
                                </h3>
                                <p className="text-xs" style={{ color: "#94a3b8" }}>
                                    Total cases per 100,000 population
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {Object.entries(COLORS).map(([key, color]) => (
                                    <div key={key} className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                                        <span className="text-xs" style={{ color: "#64748b" }}>{key}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={diseasePrevalenceData} barGap={3} barCategoryGap="25%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="region"
                                    tick={{ fontSize: 11, fill: "#64748b" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="Heart" fill={COLORS.Heart} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="BP" fill={COLORS.BP} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Sugar" fill={COLORS.Sugar} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Stress" fill={COLORS.Stress} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Line Chart */}
                    <div
                        className="rounded-2xl p-5 border"
                        style={{ background: "#fff", borderColor: "#e2e8f0" }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-sm" style={{ color: "#0a2540" }}>
                                    Chronic Disease Growth Trends
                                </h3>
                                <p className="text-xs" style={{ color: "#94a3b8" }}>
                                    12-month trajectory · National aggregate
                                </p>
                            </div>
                            <span
                                className="text-xs px-2 py-1 rounded-full font-semibold"
                                style={{ background: "#e6f0ff", color: "#0052cc" }}
                            >
                                Live
                            </span>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={growthTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 11, fill: "#64748b" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="Heart"
                                    stroke={COLORS.Heart}
                                    strokeWidth={2.5}
                                    dot={{ fill: COLORS.Heart, r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="BP"
                                    stroke={COLORS.BP}
                                    strokeWidth={2.5}
                                    dot={{ fill: COLORS.BP, r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Sugar"
                                    stroke={COLORS.Sugar}
                                    strokeWidth={2.5}
                                    dot={{ fill: COLORS.Sugar, r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Stress"
                                    stroke={COLORS.Stress}
                                    strokeWidth={2.5}
                                    dot={{ fill: COLORS.Stress, r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart >
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Disease Breakdown Cards */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { name: "Cardiac", key: "Heart", color: "#ff4d4f", bg: "#fff1f0", border: "#ffccc7", total: "17,400", growth: "+7.2%", icon: "❤️" },
                        { name: "Hypertension", key: "BP", color: "#7c3aed", bg: "#f5f0ff", border: "#d3adf7", total: "30,500", growth: "+11.4%", icon: "🩺" },
                        { name: "Diabetes", key: "Sugar", color: "#faad14", bg: "#fffbe6", border: "#ffe58f", total: "40,200", growth: "+9.8%", icon: "🧪" },
                        { name: "Stress", key: "Stress", color: "#0052cc", bg: "#e6f0ff", border: "#91caff", total: "13,300", growth: "+4.5%", icon: "🧠" },
                    ].map((d) => (
                        <div
                            key={d.key}
                            className="rounded-2xl p-4 border"
                            style={{ background: d.bg, borderColor: d.border }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xl">{d.icon}</span>
                                <span
                                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                    style={{ background: d.color + "20", color: d.color }}
                                >
                                    {d.growth}
                                </span>
                            </div>
                            <p className="text-2xl font-black" style={{ color: d.color }}>
                                {d.total}
                            </p>
                            <p className="text-xs font-medium mt-1" style={{ color: "#64748b" }}>
                                {d.name} Cases · Feb 2026
                            </p>
                            <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: d.color + "20" }}>
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: d.key === "Heart" ? "43%" : d.key === "BP" ? "76%" : d.key === "Sugar" ? "100%" : "33%",
                                        background: d.color,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
