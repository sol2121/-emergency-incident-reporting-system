import { useEffect, useState } from "react";
import { api } from "../services/api";

function MyReports() {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("Loading reports...");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  setMessage("Please login first.");
  return;
}

const response = await api.get(
  `/my_reports.php?user_id=${user.id}`
);
      if (response.data.success) {
        setReports(response.data.reports);

        if (response.data.reports.length === 0) {
          setMessage("You have not submitted any reports yet.");
        } else {
          setMessage("");
        }
      } else {
        setMessage(response.data.message);
      }

    } catch (error) {
      console.error("MY REPORTS ERROR:", error);

      setMessage("Could not load reports.");
    }
  };

  return (
    <div>
      <h1>My Emergency Reports</h1>

      {message && <p>{message}</p>}

      {reports.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Description</th>
              <th>Location</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>

                <td>{report.type}</td>

                <td>{report.description}</td>

                <td>{report.location}</td>

                <td>{report.severity}</td>

                <td>{report.status}</td>

                <td>{report.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyReports;