function Dashboard() {
  return (
    <div>
      <h1>Emergency Incident Reporting System</h1>

      <h2>Citizen Dashboard</h2>

      <p>Welcome to the Emergency Response System.</p>

      <hr />

      <button
        onClick={() => {
          window.location.href = "/report-emergency";
        }}
      >
        Report Emergency
      </button>

      <br />
      <br />

      <button
        onClick={() => {
          window.location.href = "/my-reports";
        }}
      >
        My Reports
      </button>

      <br />
      <br />

      <button>
        Emergency Status
      </button>

      <br />
      <br />

      <button>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;