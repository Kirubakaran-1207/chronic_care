"use client";

import {
    Activity, BarChart3, Bell, Globe, Heart, LayoutDashboard, LogOut,
    Settings, Shield, Stethoscope, Users,
} from "lucide-react";
import { ViewKey } from "@/app/page";

interface SidebarProps {
    activeView: ViewKey;
    setActiveView: (view: ViewKey) => void;
    onLogout: () => void;
    userRole: "doctor" | "admin";
}

export default function Sidebar({ activeView, setActiveView, onLogout, userRole }: SidebarProps) {
    return (
        <div
            className="flex flex-col h-full w-64 text-white shrink-0 relative"
            style={{
                background: "linear-gradient(175deg, #1e3a5f 0%, #2d4fa1 55%, #3b5bdb 100%)",
                boxShadow: "4px 0 24px rgba(59,91,219,0.18)",
            }}
        >
            {/* Decorative orbs */}
            <div className="absolute top-0 right-15 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: "rgba(116,143,252,0.12)", transform: "translate(30%,-30%)" }} />
            <div className="absolute bottom-32 left-0 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: "rgba(165,180,252,0.08)", transform: "translate(-40%,0)" }} />

            {/* Logo */}
            <div className="px-5 pt-6 pb-5 relative">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.1))", border: "1px solid rgba(255,255,255,0.25)" }}>
                        <Heart size={20} style={{ color: "#ffa8a8" }} fill="#ffa8a8" />
                    </div>
                    <div>
                        <p className="font-black text-sm leading-tight tracking-wide">ChronicCare</p>
                        <p className="text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>SYNC PLATFORM</p>
                    </div>
                </div>
            </div>

            {/* User Profile */}
            <div className="mx-3 mb-4 rounded-2xl px-3 py-3 relative" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shadow-md"
                        style={{ background: "linear-gradient(135deg, #ff8fab, #c9184a)" }}>
                        {userRole === "doctor" ? "PN" : "GA"}
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{userRole === "doctor" ? "Dr. Priya Nair" : "Govt. Admin"}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                            {userRole === "doctor" ? "Cardiologist · MBBS" : "Health Ministry · NHM"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-2">
                <SectionLabel text="DOCTOR PORTAL" />
                <NavItem icon={<LayoutDashboard size={15} />} label="Patient Overview" active={activeView === "overview"} onClick={() => setActiveView("overview")} />
                <NavItem icon={<Users size={15} />} label="My Patients" active={activeView === "myPatients"} onClick={() => setActiveView("myPatients")} />
                <NavItem icon={<Stethoscope size={15} />} label="Appointments" active={activeView === "appointments"} onClick={() => setActiveView("appointments")} />
                <NavItem icon={<Activity size={15} />} label="Health Monitoring" active={activeView === "healthMonitoring"} onClick={() => setActiveView("healthMonitoring")} />

                <SectionLabel text="GOVERNMENT PORTAL" />
                <NavItem icon={<Globe size={15} />} label="Regional Analytics" active={activeView === "regionalAnalytics"} onClick={() => setActiveView("regionalAnalytics")} />
                <NavItem icon={<BarChart3 size={15} />} label="Disease Trends" active={activeView === "diseaseTrends"} onClick={() => setActiveView("diseaseTrends")} />
                <NavItem icon={<Bell size={15} />} label="Alert Management" active={activeView === "alertManagement"} onClick={() => setActiveView("alertManagement")} />
            </nav>

            {/* Bottom */}
            <div className="px-3 py-3 space-y-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <NavItem icon={<Settings size={15} />} label="Settings" active={activeView === "settings"} onClick={() => setActiveView("settings")} />
                <NavItem icon={<LogOut size={15} />} label="Sign Out" active={false} onClick={onLogout} danger />
            </div>

            <div className="px-5 pb-4">
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>v2.5.0 · HIPAA Compliant · Powered by Groq</p>
            </div>
        </div>
    );
}

function SectionLabel({ text }: { text: string }) {
    return (
        <p className="text-xs font-bold px-3 pt-4 pb-1.5 tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>{text}</p>
    );
}

function NavItem({ icon, label, active, onClick, danger = false }: {
    icon: React.ReactNode; label: string; active: boolean; onClick: () => void; danger?: boolean;
}) {
    return (
        <button onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "nav-active text-white shadow-md" :
                danger ? "text-red-300 hover:bg-red-500/20 hover:text-red-200" :
                    "text-white/60 hover:bg-white/10 hover:text-white"
                }`}>
            {icon}
            {label}
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
        </button>
    );
}
