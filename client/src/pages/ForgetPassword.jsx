import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ForgetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const forget = async (userEmail) => {
    try {
      const response = await fetch(`/api/auth/forgetpassword/${userEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to reset password: " + error.message);
    }
  };
  const [error, setError] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  useEffect(() => {
    forget(email);
  }, []);
  return (
    <div className="mt-20 w-10/12 mx-auto">
      An email has been sent to {email} with a link to reset your password.
      <Link to="/signin" className="text-yellow-600">
        {" "}
        Return to sign in
      </Link>
    </div>
  );
};

export default ForgetPassword;
