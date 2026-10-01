import { useEffect, useState } from "react";
import { api } from "../services/api";

function AdminDashboard() {
 const [reports, setReports] = useState([]);
const [stats, setStats] = useState(null);
const [message, setMessage] = useState("Loading reports...");
useEffect(() => {
  loadReports();
  loadStats();
}, []);
  const loadReports = async () => {
    try {
      const response = await api.get("/admin_reports.php");

      if (response.data.success) {
        setReports(response.data.reports);
        setMessage("");
      } else {
        setMessage(response.data.message);
      }

    } catch (error) {
      console.error("ADMIN REPORT ERROR:", error);
      setMessage("Could not load emergency reports.");
    }
  };
const updateStatus = async (incidentId, status) => {
  try {

    const response = await api.post(
      "/update_status.php",
      {
        incident_id: incidentId,
        status: status
      }
    );

    if (response.data.success) {

  alert("Status updated successfully");

  loadReports();
  loadStats();

} else {

      alert(response.data.message);

    }

  } catch (error) {

    console.error("UPDATE STATUS ERROR:", error);

    alert("Could not update status");

  }
};
const loadStats = async () => {
  try {
    const response = await api.get("/admin_stats.php");

    if (response.data.success) {
      setStats(response.data.stats);
    }

  } catch (error) {
    console.error("STATS ERROR:", error);
  }
};
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {stats && (
  <div>
    <h2>Emergency Statistics</h2>

    <p>
      <strong>Total Reports:</strong>{" "}
      {stats.total}
    </p>

    <p>
      <strong>New:</strong>{" "}
      {stats.new_count}
    </p>

    <p>
      <strong>Reviewed:</strong>{" "}
      {stats.reviewed_count}
    </p>

    <p>
      <strong>Assigned:</strong>{" "}
      {stats.assigned_count}
    </p>

    <p>
      <strong>In Progress:</strong>{" "}
      {stats.in_progress_count}
    </p>

    <p>
      <strong>Resolved:</strong>{" "}
      {stats.resolved_count}
    </p>
  </div>
)}
      <h2>Emergency Reports</h2>

      {message && <p>{message}</p>}

      {reports.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Citizen</th>
              <th>Email</th>
              <th>Type</th>
              <th>Description</th>
              <th>Location</th>
              <th>Severity</th>
             <th>Status</th>
             <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.name}</td>
                <td>{report.email}</td>
                <td>{report.type}</td>
                <td>{report.description}</td>
                <td>{report.location}</td>
                <td>{report.severity}</td>
               <td>
  <select
    value={report.status}
    onChange={(e) =>
      updateStatus(report.id, e.target.value)
    }
  >
    <option value="new">New</option>
    <option value="reviewed">Reviewed</option>
    <option value="assigned">Assigned</option>
    <option value="in_progress">In Progress</option>
    <option value="resolved">Resolved</option>
  </select>
</td>

<td>
  <button
    onClick={() =>
      updateStatus(report.id, report.status)
    }
  >
    Update
  </button>
</td>
                <td>{report.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;