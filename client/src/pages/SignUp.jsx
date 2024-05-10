import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    password: "",
    profilePicture: null, // Initialize profilePicture as null
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "profilePicture") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("profilePicture", formData.profilePicture); // Append profile picture to FormData

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: data, // Send FormData object instead of JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
        setLoading(false);
      }

      console.log("SignUp successful");
      setLoading(false);
      window.location.href = `/`;
    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.error("There was a problem with the post request:", error);
    }
  };

  return (
    <div className="flex mt-[40px] w-full md:w-full lg:w-10/12 mx-auto justify-center items-center sm:px-10 md:px-32 gap-2">
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
            recipies to the world. Please Sign Up with your account to continue
          </span>
        </div>
      </div>
      <div className="form-cotainer md:flex-1 w-10/12 sm:w-8/12 md:w-4/12">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl border-[1px]  shadow-slate-300 rounded-xl p-6 mt-10 mx-auto w-full"
        >
          {error && (
            <div className="relative my-6 p-2 text-red-600">{error}</div>
          )}

          <div className="relative my-6">
            <input
              id="name"
              type="text"
              name="name"
              placeholder="your name"
              minLength={10}
              onChange={handleChange}
              className="peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white   focus:border-yellow-500 focus:outline-none  focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              required
            />
            <label
              htmlFor="name"
              className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer- peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-yellow-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              name
            </label>
          </div>
          <div className="relative my-6 flex gap-2 w-full items-center  rounded border border-slate-200 text-sm text-slate-500">
            <input
              id="file-upload"
              name="profilePicture"
              onChange={handleChange}
              type="file"
              className="peer order-2 [&::file-selector-button]:hidden"
              required
            />
            <label
              htmlFor="file-upload"
              className="inline-flex p-3 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded bg-yellow-400 px-6 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-yellow-500 focus:bg-yellow-500 focus-visible:outline-none peer-disabled:cursor-not-allowed peer-disabled:border-yellow-300 peer-disabled:bg-yellow-300"
            >
              {" "}
              Profile Picture{" "}
            </label>
          </div>
          <div className="relative my-6">
            <input
              id="email"
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="your email"
              className="peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white   focus:border-yellow-500 focus:outline-none  focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer- peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-yellow-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              email
            </label>
          </div>
          <div className="relative my-6">
            <input
              id="password"
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="your password"
              className="peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white   focus:border-yellow-500 focus:outline-none  focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer- peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-yellow-500  peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              Create password
            </label>
          </div>

          <div className="btn-section mb-1 flex flex-col justify-center items-center">
            <button
              className="bg-yellow-400 p-2 w-full rounded-md text-white"
              type="submit"
              disabled={loading}
            >
              Sign Up {loading && "..."}
            </button>
          </div>
          <small>
            Already have an account?{" "}
            <Link to="/signin" className="text-yellow-500 ">
              Sign In
            </Link>
          </small>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
