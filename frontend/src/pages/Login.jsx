import { useState } from "react";
import { api } from "../services/api";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const response = await api.post(
        "/login.php",
        formData
      );

      setMessage(response.data.message);

     if (response.data.success) {
  localStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
  );

  window.location.href = "/dashboard";
}
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Could not connect to the server");
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <br />

        <button type="submit">
          Login
        </button>

      </form>

      <p>{message}</p>
    </div>
  );
}

export default Login;