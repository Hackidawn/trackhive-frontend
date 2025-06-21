import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import CreateTicket from "./pages/CreateTicket";
import KanbanBoard from "./pages/KanbanBoard";
import FilterSearch from "./pages/FilterSearch";
import TeamManagement from "./pages/TeamManagement";
import ProjectView from "./pages/ProjectView";
import Account from "./pages/Account";

// ✅ Import LandingPage
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Landing Page as Homepage */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />

        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/create-ticket/:projectId" element={<CreateTicket />} />
        <Route path="/board/:projectId" element={<KanbanBoard />} />
        <Route path="/search/:projectId" element={<FilterSearch />} />
        <Route path="/project/:projectId/team" element={<TeamManagement />} />
        <Route path="/project/:projectId" element={<ProjectView />} />
      </Routes>
     </BrowserRouter>
  );
} 

export default App;
