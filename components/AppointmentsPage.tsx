"use client";

import { useState } from "react";
import { mockPatients } from "@/lib/mockData";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus, ChevronLeft, ChevronRight, X } from "lucide-react";

interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    disease: string;
    riskLevel: string;
    date: string;
    time: string;
    type: string;
    status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
}

const mockAppointments: Appointment[] = [
    { id: "A001", patientId: "PAT-005", patientName: "Ravi Chandrasekaran", disease: "Heart", riskLevel: "High", date: "2026-02-27", time: "09:00", type: "Urgent Review", status: "Confirmed" },
    { id: "A002", patientId: "PAT-003", patientName: "Venkatesh Iyer", disease: "BP", riskLevel: "High", date: "2026-02-27", time: "10:30", type: "Follow-up", status: "Confirmed" },
    { id: "A003", patientId: "PAT-001", patientName: "Arjun Sharma", disease: "Heart", riskLevel: "High", date: "2026-02-27", time: "12:00", type: "Cardiac Check", status: "Pending" },
    { id: "A004", patientId: "PAT-002", patientName: "Meera Krishnamurthy", disease: "Sugar", riskLevel: "Medium", date: "2026-02-27", time: "14:30", type: "Diabetes Review", status: "Completed" },
    { id: "A005", patientId: "PAT-004", patientName: "Lakshmi Patel", disease: "Stress", riskLevel: "Low", date: "2026-02-28", time: "09:30", type: "Counselling", status: "Confirmed" },
    { id: "A006", patientId: "PAT-006", patientName: "Divya Menon", disease: "Sugar", riskLevel: "Low", date: "2026-03-01", time: "11:00", type: "Routine Check", status: "Confirmed" },
    { id: "A007", patientId: "PAT-001", patientName: "Arjun Sharma", disease: "Heart", riskLevel: "High", date: "2026-03-05", time: "10:00", type: "Echo follow-up", status: "Confirmed" },
    { id: "A008", patientId: "PAT-002", patientName: "Meera Krishnamurthy", disease: "Sugar", riskLevel: "Medium", date: "2026-03-10", time: "15:00", type: "HbA1c Review", status: "Pending" },
];

const DAYS_IN_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const diseaseColor: Record<string, { color: string; bg: string }> = {
    Heart: { color: "#ff4d4f", bg: "#fff1f0" },
    BP: { color: "#7c3aed", bg: "#f5f0ff" },
    Sugar: { color: "#faad14", bg: "#fffbe6" },
    Stress: { color: "#0052cc", bg: "#e6f0ff" },
};
const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    Confirmed: { color: "#0052cc", bg: "#e6f0ff", icon: <CheckCircle size={12} /> },
    Pending: { color: "#faad14", bg: "#fffbe6", icon: <AlertCircle size={12} /> },
    Completed: { color: "#52c41a", bg: "#f6ffed", icon: <CheckCircle size={12} /> },
    Cancelled: { color: "#ff4d4f", bg: "#fff1f0", icon: <XCircle size={12} /> },
};

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

export default function AppointmentsPage() {
    const today = new Date("2026-02-27");
    const [calYear, setCalYear] = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<string>("2026-02-27");
    const [showBookModal, setShowBookModal] = useState(false);

    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfMonth(calYear, calMonth);
    const apptsByDate = mockAppointments.reduce<Record<string, Appointment[]>>((acc, a) => {
        acc[a.date] = [...(acc[a.date] || []), a];
        return acc;
    }, {});

    const selectedAppts = apptsByDate[selectedDate] || [];

    const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); } else setCalMonth(m => m - 1); };
    const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); } else setCalMonth(m => m + 1); };

    return (
        <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between" style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: "#0a2540" }}>Appointments</h1>
                    <p className="text-sm" style={{ color: "#64748b" }}>Schedule & manage patient appointments</p>
                </div>
                <button
                    onClick={() => setShowBookModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #0052cc, #1a73e8)" }}
                >
                    <Plus size={14} /> Book Appointment
                </button>
            </div>

            <div className="p-6 grid grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="col-span-2 rounded-2xl border p-5" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
                    {/* Month nav */}
                    <div className="flex items-center justify-between mb-5">
                        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><ChevronLeft size={16} style={{ color: "#64748b" }} /></button>
                        <h2 className="text-base font-bold" style={{ color: "#0a2540" }}>{MONTHS[calMonth]} {calYear}</h2>
                        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><ChevronRight size={16} style={{ color: "#64748b" }} /></button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 mb-2">
                        {DAYS_IN_WEEK.map(d => (
                            <p key={d} className="text-center text-xs font-semibold py-1" style={{ color: "#94a3b8" }}>{d}</p>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                            const dayAppts = apptsByDate[dateStr] || [];
                            const isToday = dateStr === "2026-02-27";
                            const isSelected = dateStr === selectedDate;
                            const hasHigh = dayAppts.some(a => a.riskLevel === "High");

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDate(dateStr)}
                                    className="relative flex flex-col items-center py-2 rounded-xl transition-all"
                                    style={{
                                        background: isSelected ? "#0052cc" : isToday ? "#e6f0ff" : "transparent",
                                        color: isSelected ? "#fff" : isToday ? "#0052cc" : "#0a2540",
                                    }}
                                >
                                    <span className="text-sm font-medium">{day}</span>
                                    {dayAppts.length > 0 && (
                                        <div className="flex gap-0.5 mt-0.5">
                                            {dayAppts.slice(0, 3).map((a, di) => (
                                                <div key={di} className="w-1.5 h-1.5 rounded-full" style={{ background: isSelected ? "#fff" : a.riskLevel === "High" ? "#ff4d4f" : a.riskLevel === "Medium" ? "#faad14" : "#52c41a" }} />
                                            ))}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 mt-4 pt-4" style={{ borderTop: "1px solid #e2e8f0" }}>
                        {[{ color: "#ff4d4f", label: "High Risk" }, { color: "#faad14", label: "Medium" }, { color: "#52c41a", label: "Low Risk" }].map(l => (
                            <div key={l.label} className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                                <p className="text-xs" style={{ color: "#64748b" }}>{l.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Appointment list for selected date */}
                <div className="rounded-2xl border p-4 overflow-y-auto max-h-[480px]" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar size={14} style={{ color: "#0052cc" }} />
                        <p className="text-sm font-bold" style={{ color: "#0a2540" }}>
                            {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                        </p>
                    </div>

                    {selectedAppts.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar size={40} style={{ color: "#cbd5e0" }} className="mx-auto mb-2" />
                            <p className="text-xs" style={{ color: "#94a3b8" }}>No appointments</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {selectedAppts.map(a => {
                                const dc = diseaseColor[a.disease];
                                const sc = statusConfig[a.status];
                                return (
                                    <div key={a.id} className="rounded-xl p-3 border" style={{ borderColor: "#e2e8f0" }}>
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: dc.bg, color: dc.color }}>
                                                    {a.patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold" style={{ color: "#0a2540" }}>{a.patientName}</p>
                                                    <p className="text-xs" style={{ color: "#94a3b8" }}>{a.patientId}</p>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: sc.bg, color: sc.color }}>
                                                {sc.icon} {a.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs" style={{ color: "#64748b" }}>{a.type}</p>
                                            <div className="flex items-center gap-1 text-xs" style={{ color: "#0052cc" }}>
                                                <Clock size={10} />{a.time}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Today's full schedule */}
            <div className="px-6 pb-6">
                <h3 className="text-sm font-bold mb-3" style={{ color: "#0a2540" }}>All Upcoming Appointments</h3>
                <div className="space-y-2">
                    {mockAppointments.filter(a => a.date >= "2026-02-27").map(a => {
                        const dc = diseaseColor[a.disease];
                        const sc = statusConfig[a.status];
                        return (
                            <div key={a.id} className="flex items-center gap-4 px-4 py-3 rounded-xl border" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{ background: dc.bg, color: dc.color }}>
                                    {a.patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold" style={{ color: "#0a2540" }}>{a.patientName}</p>
                                    <p className="text-xs" style={{ color: "#64748b" }}>{a.type} · {a.patientId}</p>
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: dc.bg, color: dc.color }}>{a.disease}</span>
                                <div className="text-right">
                                    <p className="text-xs font-semibold" style={{ color: "#0a2540" }}>{new Date(a.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {a.time}</p>
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: sc.bg, color: sc.color }}>
                                    {sc.icon} {a.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Book Appointment Modal */}
            {showBookModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0" style={{ background: "rgba(10,37,64,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setShowBookModal(false)} />
                    <div className="relative rounded-2xl p-6 w-full max-w-md shadow-2xl fade-in" style={{ background: "#fff" }}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold" style={{ color: "#0a2540" }}>Book Appointment</h3>
                            <button onClick={() => setShowBookModal(false)}><X size={18} style={{ color: "#64748b" }} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Patient</label>
                                <select className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: "#e2e8f0", background: "#f8fafc", color: "#0a2540" }}>
                                    {mockPatients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Date</label>
                                    <input type="date" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: "#e2e8f0", background: "#f8fafc", color: "#0a2540" }} defaultValue="2026-03-01" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Time</label>
                                    <input type="time" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: "#e2e8f0", background: "#f8fafc", color: "#0a2540" }} defaultValue="10:00" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Type</label>
                                <select className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: "#e2e8f0", background: "#f8fafc", color: "#0a2540" }}>
                                    {["Routine Check", "Follow-up", "Urgent Review", "Lab Results", "Counselling", "Post-procedure Review"].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowBookModal(false)} className="flex-1 py-3 rounded-xl border text-sm font-semibold" style={{ borderColor: "#e2e8f0", color: "#64748b" }}>Cancel</button>
                            <button onClick={() => setShowBookModal(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #0052cc, #1a73e8)" }}>Confirm Booking</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
