import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [checked, setChecked] = useState(false);
  const [formData, setFormData] = useState({ userId: "", password: "" });

  const resetPassword = async (userId, newPassword) => {
    try {
      const response = await fetch(`/api/auth/resetpassword/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
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

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");
  const handleSubmit = async (event) => {
    event.preventDefault();

    const password = formData.password;
    try {
      const response = await resetPassword(userId, password);
      alert(response.message);
      window.location.href = "/signin";
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="mt-32 w-full flex flex-col justify-center items-center min-h-8/12">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl border-[1px] shadow-slate-300 rounded-xl p-6 mt-10 mx-auto w-full sm:w-10/12 md:w-8/12 lg:w-5/12"
      >
        <div className="relative my-6">
          <input
            id="password"
            type={checked ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your new password"
            className="peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-yellow-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          <label
            htmlFor="password"
            className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-yellow-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
          >
            New password
          </label>
        </div>
        <div className="relative mb-6 mt-2 flex flex-wrap items-center">
          <input
            className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-slate-500 bg-white transition-colors checked:border-yellow-500 checked:bg-yellow-500 checked:hover:border-yellow-600 checked:hover:bg-yellow-600 focus:outline-none checked:focus:border-yellow-700 checked:focus:bg-yellow-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            id="showPassword"
          />
          <label
            className="cursor-pointer text-sm pl-2 text-slate-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
            htmlFor="showPassword"
          >
            Show Password
          </label>
          <svg
            className="pointer-events-none absolute left-0 top-1 h-4 w-4 -rotate-90 fill-white stroke-white opacity-0 transition-all duration-300 peer-checked:rotate-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            aria-labelledby="title-1 description-1"
            role="graphics-symbol"
          >
            <title id="title-1">Check mark icon</title>
            <desc id="description-1"></desc>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.8116 5.17568C12.9322 5.2882 13 5.44079 13 5.5999C13 5.759 12.9322 5.91159 12.8116 6.02412L7.66416 10.8243C7.5435 10.9368 7.37987 11 7.20925 11C7.03864 11 6.87501 10.9368 6.75435 10.8243L4.18062 8.42422C4.06341 8.31105 3.99856 8.15948 4.00002 8.00216C4.00149 7.84483 4.06916 7.69434 4.18846 7.58309C4.30775 7.47184 4.46913 7.40874 4.63784 7.40737C4.80655 7.406 4.96908 7.46648 5.09043 7.57578L7.20925 9.55167L11.9018 5.17568C12.0225 5.06319 12.1861 5 12.3567 5C12.5273 5 12.691 5.06319 12.8116 5.17568Z"
            />
          </svg>
        </div>
        <button
          className="bg-yellow-500 p-2 rounded-md text-white"
          type="submit"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
