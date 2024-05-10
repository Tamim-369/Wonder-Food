import React, { useEffect, useState } from "react";
import profilePic from "../assets/user.svg";
import { IoIosNotifications } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({
  profilePicture,
  findPicture,
  loggedInUserProfilePicture,
  userData,
}) => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [isClickedN, setIsClickedN] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);

  const navigate = useNavigate();
  return (
    <>
      {/*<!-- Component: Navbar with Avatar --> */}
      {/*<!-- Header --> */}
      <header className="border-b-1 fixed top-0 z-20 w-full border-b border-slate-200 bg-white/90 shadow-lg shadow-slate-700/5 after:absolute after:top-full after:left-0 after:z-10 after:block after:h-px after:w-full after:bg-slate-200 lg:border-slate-200 lg:backdrop-blur-sm lg:after:hidden ">
        <div className="relative mx-auto max-w-full px-6 lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[96rem]">
          <nav
            aria-label="main navigation"
            className="flex  items-center h-[4rem]  justify-between font-medium text-slate-700"
            role="navigation"
          >
            <div className="link">
              {/*      <!-- Brand logo --> */}
              <Link
                id="WindUI"
                aria-label="WindUI logo"
                aria-current="page"
                className="flex justify-center items-center focus:outline-none  lg:flex-1 font-bold rounded-md text-xl text-white p-[5px] "
                to="/"
              >
                <span className=" text-yellow-500 ">
                  <span className=" text-yellow-600 font-bold">W</span>
                  onder
                </span>
                <span className="font-bold text-yellow-500">food</span>
              </Link>
            </div>

            {isLoggedIn ? (
              <>
                {/*      <!-- Mobile trigger --> */}
                <button
                  className={`relative order-10 block h-10 w-10 self-center lg:hidden
              ${
                isToggleOpen
                  ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(3)]:w-0 [&_span:nth-child(2)]:-rotate-45 "
                  : ""
              }
            `}
                  onClick={() => setIsToggleOpen(!isToggleOpen)}
                  aria-expanded={isToggleOpen ? "true" : "false"}
                  aria-label="Toggle navigation"
                >
                  <div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
                    <span
                      aria-hidden="true"
                      className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
                    ></span>
                    <span
                      aria-hidden="true"
                      className="absolute block h-0.5 w-6 transform rounded-full bg-slate-900 transition duration-300"
                    ></span>
                    <span
                      aria-hidden="true"
                      className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
                    ></span>
                  </div>
                </button>
                {/*      <!-- Navigation links --> */}
                <ul
                  role="menubar"
                  aria-label="Select page"
                  className={`absolute top-0 left-0 z-[-1] h-[28.5rem] w-full justify-center overflow-hidden  overflow-y-auto overscroll-contain bg-white/90 px-8 pb-12 pt-24 font-medium transition-[opacity,visibility] duration-300 lg:visible lg:relative lg:top-0  lg:z-0 lg:flex lg:h-full lg:w-auto lg:items-stretch lg:overflow-visible lg:bg-white/0 lg:px-0 lg:py-0  lg:pt-0 lg:opacity-100 ${
                    isToggleOpen
                      ? "visible opacity-100 backdrop-blur-sm"
                      : "invisible opacity-0"
                  }`}
                >
                  <li role="none" className="flex items-stretch">
                    <Link
                      role="menuitem"
                      aria-haspopup="false"
                      className="flex items-center gap-2 py-4 transition-colors duration-300 hover:text-yellow-500 focus:text-yellow-600 focus:outline-none focus-visible:outline-none lg:px-8 "
                      to="/"
                    >
                      <span>All Recipes</span>
                    </Link>
                  </li>
                  <li role="none" className="flex items-stretch">
                    <Link
                      to={"/allrestaurants"}
                      role="menuitem"
                      aria-current="page"
                      aria-haspopup="false"
                      className="flex items-center gap-2 py-4  transition-colors duration-300 hover:text-yellow-600 focus:text-yellow-600 focus:outline-none focus-visible:outline-none lg:px-8"
                    >
                      <span>All Chefs</span>
                    </Link>
                  </li>
                  <li role="none" className="flex items-stretch">
                    <Link
                      role="menuitem"
                      aria-haspopup="false"
                      className="flex items-center gap-2 py-4 transition-colors duration-300 hover:text-yellow-500 focus:text-yellow-600 focus:outline-none focus-visible:outline-none lg:px-8"
                      to={`/about`}
                    >
                      <span>About</span>
                    </Link>
                  </li>
                </ul>
                <div className="ml-auto flex justify-center items-center px-6 gap-2 lg:ml-0 lg:p-0">
                  {/*        <!-- Avatar --> */}

                  <button
                    type="button"
                    onClick={() => setIsClicked(!isClicked)}
                    className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white bg-no-repeat bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${findPicture(
                        "profilePicture",
                        userData.profilePicture
                      )})`,
                    }}
                  >
                    {/* <img
                      src={profilePicture}
                      alt="user name"
                      title="user name"
                      width="40"
                      height="100"
                      className=" object-cover rounded-full"
                    /> */}
                  </button>
                  {isClicked && (
                    <div className="flex  flex-col justify-center absolute top-14 z-30 items-center bg-slate-50 text-black rounded-md  shadow-md px-2">
                      <Link
                        onClick={() => setIsClicked(!isClicked)}
                        to="/"
                        className="p-2 border-b-[1px] w-full text-center border-gray-400"
                      >
                        {userData.name}
                      </Link>
                      <Link
                        onClick={() => setIsClicked(!isClicked)}
                        to={`/createPost`}
                        className="p-2 border-b-[1px] w-full text-center border-gray-400"
                      >
                        Create Post
                      </Link>
                      <Link
                        onClick={() => setIsClicked(!isClicked)}
                        to="/profile"
                        className="p-2 border-b-[1px] w-full text-center border-gray-400"
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsClicked(!isClicked);
                          localStorage.removeItem("token");
                          localStorage.removeItem("email");
                          localStorage.removeItem("profilePicture");
                          location.reload();
                        }}
                        className="p-2 w-full text-center border-none"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <Link
                  to={"/signin"}
                  className="p-2 bg-yellow-500 text-white rounded-xl"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
