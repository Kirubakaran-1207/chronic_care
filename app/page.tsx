"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DoctorDashboard from "@/components/DoctorDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import LoginPage from "@/components/LoginPage";
import MyPatientsPage from "@/components/MyPatientsPage";
import AppointmentsPage from "@/components/AppointmentsPage";
import HealthMonitoringPage from "@/components/HealthMonitoringPage";
import DiseaseTrendsPage from "@/components/DiseaseTrendsPage";
import AlertManagementPage from "@/components/AlertManagementPage";
import SettingsPage from "@/components/SettingsPage";
import PrescriptionsPage from "@/components/PrescriptionsPage";
import { Shield } from "lucide-react";

export type ViewKey =
  | "overview"
  | "myPatients"
  | "appointments"
  | "healthMonitoring"
  | "prescriptions"
  | "alertManagement"
  | "regionalAnalytics"
  | "diseaseTrends"
  | "settings";

// Pages that require admin role
const ADMIN_ONLY_VIEWS: ViewKey[] = ["regionalAnalytics", "diseaseTrends"];

function AccessDenied({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{ background: "#fee2e2" }}>
        <Shield size={36} style={{ color: "#ef4444" }} />
      </div>
      <div className="text-center max-w-sm">
        <h2 className="text-2xl font-black mb-2" style={{ color: "#1a1f36" }}>Access Restricted</h2>
        <p className="text-sm" style={{ color: "#64748b" }}>
          This page is restricted to Government Administrators only.
          Doctors can access Patient Overview, My Patients, Appointments,
          Health Monitoring, Prescriptions, and Alert Management.
        </p>
      </div>
      <button onClick={onBack}
        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
        style={{ background: "linear-gradient(135deg, #4c6ef5, #7c3aed)" }}>
        Go back to Dashboard
      </button>
    </div>
  );
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"doctor" | "admin">("doctor");
  const [activeView, setActiveView] = useState<ViewKey>("overview");

  const handleLogin = (role: "doctor" | "admin") => {
    setUserRole(role);
    setActiveView(role === "admin" ? "regionalAnalytics" : "overview");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView("overview");
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // RBAC guard: block doctor from admin-only pages
  const isAccessDenied = userRole === "doctor" && ADMIN_ONLY_VIEWS.includes(activeView);

  const renderPage = () => {
    if (isAccessDenied) return <AccessDenied onBack={() => setActiveView("overview")} />;

    switch (activeView) {
      case "overview": return <DoctorDashboard />;
      case "myPatients": return <MyPatientsPage />;
      case "appointments": return <AppointmentsPage />;
      case "healthMonitoring": return <HealthMonitoringPage />;
      case "prescriptions": return <PrescriptionsPage />;
      case "alertManagement": return <AlertManagementPage />;
      case "regionalAnalytics": return <AdminDashboard />;
      case "diseaseTrends": return <DiseaseTrendsPage />;
      case "settings": return <SettingsPage />;
      default: return <DoctorDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f0f4f8" }}>
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
        userRole={userRole}
      />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}
