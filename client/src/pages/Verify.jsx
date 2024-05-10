import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Verify = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");
  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/users/verify/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("User Verified successfully");
        window.location.href = "/signin";
      } else {
        throw new Error("Failed to verify user");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to verify user. Please try again.");
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  return <div className="mt-20"></div>;
};

export default Verify;
