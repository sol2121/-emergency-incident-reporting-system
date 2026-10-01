import { useState } from "react";
import { api } from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
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
        "/register.php",
        formData
      );

      setMessage(response.data.message);

      if (response.data.success) {
        setFormData({
          name: "",
          email: "",
          password: "",
        });
      }

    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Could not connect to the server");
      }
    }
  };

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Name</label>
          <br />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        <br />

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
          Register
        </button>

      </form>

      <p>{message}</p>
    </div>
  );
}

export default Register; 