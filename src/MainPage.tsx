import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useVaccines } from "./hooks/useVaccines";
import { LoginPage } from "./components/LoginPage";
import { AccessDenied } from "./components/AccessDenied";
import { Header } from "./components/Header";
import { StatsBar } from "./components/StatsBar";
import { FilterBar } from "./components/FilterBar";
import { Timeline } from "./components/Timeline";
import { VaccineEditModal } from "./components/VaccineEditModal";
import { Footer } from "./components/Footer";
import type { Vaccine } from "./types";
import type { FilterType } from "./utils/vaccine";

export function MainPage() {
  const { session, isLoading: authLoading } = useAuth();
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [editingVaccine, setEditingVaccine] = useState<Vaccine | null>(null);

  const {
    data: vaccines,
    isLoading: vaccinesLoading,
    isError,
    error,
  } = useVaccines();

  // Show spinner while auth is loading
  if (authLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  // Not authenticated — show login
  if (!session) {
    return <LoginPage />;
  }

  // Check for 403 (access denied)
  if (isError && (error as any)?.response?.status === 403) {
    return <AccessDenied />;
  }

  // Loading vaccines
  if (vaccinesLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  // Error state (non-403)
  if (isError) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "60px 0" }}>
        <p style={{ color: "#ef5350" }}>
          {"\u8F09\u5165\u5931\u6557\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66"}
        </p>
      </div>
    );
  }

  const vaccineList = vaccines ?? [];

  return (
    <div className="container">
      <Header />
      <StatsBar vaccines={vaccineList} />
      <FilterBar
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
      />
      <Timeline
        vaccines={vaccineList}
        currentFilter={currentFilter}
        isAuthenticated={!!session}
        onEdit={setEditingVaccine}
      />
      <Footer />
      {editingVaccine && (
        <VaccineEditModal
          vaccine={editingVaccine}
          onClose={() => setEditingVaccine(null)}
        />
      )}
    </div>
  );
}
