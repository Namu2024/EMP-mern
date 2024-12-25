import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Setting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [setting, setSetting] = useState({
    userId: user._id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetting({ ...setting, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !setting.oldPassword ||
      !setting.newPassword ||
      !setting.confirmPassword
    ) {
      setError("All fields are required");
      setSuccess(null);
      return;
    }
    if (setting.newPassword !== setting.confirmPassword) {
      setError("Passwords do not match");
      setSuccess(null);
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/setting/change-password",
        setting,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setSuccess("Password changed successfully!");
        setError(null);
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
        setSuccess(null);
      } else {
        setError("An error occurred. Please try again.");
        setSuccess(null);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Old Password
          </label>
          <input
            type="password"
            name="oldPassword"
            placeholder="Enter your old password"
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter your new password"
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your new password"
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default Setting;
