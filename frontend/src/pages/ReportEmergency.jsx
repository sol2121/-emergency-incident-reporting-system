import { useState } from "react";
import { api } from "../services/api";

function ReportEmergency() {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    location: "",
    severity: "medium",
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  try {
    const response = await api.post(
      "/report.php",
      {
        ...formData,
        user_id: user.id,
      }
    );

    setMessage(response.data.message);

    if (response.data.success) {
      setFormData({
        type: "",
        description: "",
        location: "",
        severity: "medium",
      });
    }

  } catch (error) {
    console.error("REPORT ERROR:", error);

    if (error.response) {
      setMessage(
        JSON.stringify(error.response.data)
      );
    } else {
      setMessage("Could not connect to the server");
    }
  }
};

  return (
    <div>
      <h1>Report Emergency</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Emergency Type</label>
          <br />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select emergency type</option>
            <option value="Accident">Accident</option>
            <option value="Fire">Fire</option>
            <option value="Medical">Medical Emergency</option>
            <option value="Crime">Crime</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what happened"
            rows="5"
            required
          />
        </div>

        <br />

        <div>
          <label>Location</label>
          <br />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter emergency location"
            required
          />
        </div>

        <br />

        <div>
          <label>Severity</label>
          <br />

          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <br />

        <button type="submit">
          Submit Emergency Report
        </button>

      </form>

      <p>{message}</p>
    </div>
  );
}

export default ReportEmergency;