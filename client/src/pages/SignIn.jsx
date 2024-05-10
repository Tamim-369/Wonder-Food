import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import jwt from "jsonwebtoken";
const SignIn = ({ findPicture }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        throw new Error(errorData.error);
      }
      const resData = await response.json();
      localStorage.setItem("token", resData.token);
      localStorage.setItem("email", resData.userEmail);
      localStorage.setItem(
        "profilePicture",
        findPicture("profilePicture", resData.profilePicture)
      );
      navigate("/");
      location.reload();
    } catch (error) {
      console.error("There was a problem with the post request:", error);
    }
  };

  return (
    <div className="flex mt-24 w-full md:w-full lg:w-10/12 mx-auto justify-center items-center sm:px-10 md:px-32 gap-2">
      <div className="intro flex-1 hidden md:flex flex-col">
        <div className="">
          <Link
            id="WindUI"
            aria-label="WindUI logo"
            aria-current="page"
            className="flex mb-2 focus:outline-none text-3xl lg:flex-1 font-bold rounded-md  text-white  "
            to="/"
          >
            <span className=" text-yellow-500">
              <span className=" text-yellow-600 font-bold">W</span>
              onder
            </span>
            <span className="font-bold text-yellow-500">food</span>
          </Link>
          <span className="text-md text-gray-800">
            Wonderfood is a social media platform to share unique and amazing
            recipies to the world. Please sign In with your account to continue
          </span>
        </div>
      </div>
      <div className="form-cotainer md:flex-1 w-10/12 sm:w-8/12 md:w-4/12">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl border-[1px] shadow-slate-300 rounded-xl p-6 mt-10 mx-auto w-full"
        >
          {error ? (
            <div className="relative my-6 p-2 text-red-400">{error}</div>
          ) : (
            ""
          )}
          <div className="relative my-6">
            <input
              id="id-01"
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="your email"
              className="peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-yellow-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />
            <label
              htmlFor="id-01"
              className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-yellow-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              Your email
            </label>
          </div>
          <div className="relative my-6">
            <input
              id="id-02"
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="your password"
              className="peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-yellow-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />
            <label
              htmlFor="id-02"
              className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-yellow-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              Your password
            </label>
            <small className="ml-1 ">
              <Link
                to={`${
                  formData.email
                    ? `/forgetpassword?email=${formData.email}`
                    : `/signin`
                }`}
                onClick={() =>
                  !formData.email && alert("please enter your email")
                }
                className="text-yellow-500 border-b-[1px] border-yellow-500"
              >
                Forget Password
              </Link>
            </small>
          </div>
          <div className="btn-section mb-1 flex flex-col justify-center items-center">
            <button
              className="bg-yellow-400 p-2 w-full rounded-md text-white"
              type="submit"
            >
              Sign In
            </button>
          </div>
          <small>
            Don't have an account?{" "}
            <Link to="/signup" className="text-yellow-500 ">
              Sign Up
            </Link>
          </small>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
