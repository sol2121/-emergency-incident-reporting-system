import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyReports from "./pages/MyReports";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportEmergency from "./pages/ReportEmergency";
import AdminDashboard from "./pages/AdminDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
<Route
  path="/admin"
  element={<AdminDashboard />}
/>
        <Route
          path="/report-emergency"
          element={<ReportEmergency />}
        />
        <Route path="/my-reports" element={<MyReports />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;