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

export type ViewKey =
  | "overview"
  | "myPatients"
  | "appointments"
  | "healthMonitoring"
  | "regionalAnalytics"
  | "diseaseTrends"
  | "alertManagement"
  | "settings";

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

  const renderPage = () => {
    switch (activeView) {
      case "overview": return <DoctorDashboard />;
      case "myPatients": return <MyPatientsPage />;
      case "appointments": return <AppointmentsPage />;
      case "healthMonitoring": return <HealthMonitoringPage />;
      case "regionalAnalytics": return <AdminDashboard />;
      case "diseaseTrends": return <DiseaseTrendsPage />;
      case "alertManagement": return <AlertManagementPage />;
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
