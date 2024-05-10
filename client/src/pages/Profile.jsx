import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = ({
  profilePicture,
  userData,
  getPosts,
  getUser,
  findPicture,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  const [formData, setFormData] = useState(userData);
  const navigate = useNavigate();
  const [profilePosts, setProfilePosts] = useState([]);

  const [imageFile, setImageFile] = useState("");
  const [imageFileUrl, setImageFileUrl] = useState("");
  const [formChanged, setFormChanged] = useState(false); // Track form changes
  const [loading, setLoading] = useState(true); // Track loading state
  const getSetPosts = async (email) => {
    try {
      const posts = await getPosts(email);
      if (posts) {
        const sortedPosts = posts.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setProfilePosts(sortedPosts);
      } else {
        throw new Error("No posts found");
      }
    } catch (error) {
      console.error("Error fetching or sorting posts:", error);
      // Handle error as needed, such as displaying an error message to the user
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedDate = `${[day]} ${months[month]},${year}`;
    return formattedDate;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormChanged(true); // Form data changed
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePicture: file,
      });
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file)); // Create URL for display
      setFormChanged(true); // Form data changed
    }
  };

  useEffect(() => {
    setFormData(userData);
    setImageFileUrl(profilePicture); // Update image URL
  }, [userData, profilePicture]);

  const updateUser = async () => {
    try {
      const newUserData = new FormData();
      const image = imageFile ? imageFile : profilePicture;
      newUserData.append("name", formData.name);
      newUserData.append("email", formData.email);
      newUserData.append("bio", formData.bio);
      newUserData.append("password", formData.password);
      newUserData.append("profilePicture", image);

      const response = await fetch(`/api/users/update/${userData._id}`, {
        method: "PUT",
        body: newUserData,
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      localStorage.setItem("email", data.email);
      alert("Updated successfully");
      location.reload();
      return data;
    } catch (error) {
      throw new Error("Failed to update user: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formChanged) return; // Skip if no changes
    const response = await updateUser(formData);
    console.log("Updated data:", formData);
    console.log(response.json());
    setFormChanged(false); // Reset form changed state after submission
  };

  const [tabSelected, setTabSelected] = useState({
    currentTab: 1,
    noTabs: 3,
  });
  const wrapperRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.keyCode === 39) {
      if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        if (
          tabSelected.currentTab >= 1 &&
          tabSelected.currentTab < tabSelected.noTabs
        ) {
          setTabSelected({
            ...tabSelected,
            currentTab: tabSelected.currentTab + 1,
          });
        } else {
          setTabSelected({
            ...tabSelected,
            currentTab: 1,
          });
        }
      }
    }

    if (e.keyCode === 37) {
      if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        if (
          tabSelected.currentTab > 1 &&
          tabSelected.currentTab <= tabSelected.noTabs
        ) {
          setTabSelected({
            ...tabSelected,
            currentTab: tabSelected.currentTab - 1,
          });
        } else {
          setTabSelected({
            ...tabSelected,
            currentTab: tabSelected.noTabs,
          });
        }
      }
    }
  };

  useEffect(() => {
    getUser();
    getSetPosts(localStorage.getItem("email"));
    if (localStorage.getItem("token") && localStorage.getItem("email")) {
      setIsLoggedIn(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <div className="mt-16 flex flex-col w-full min-h-10/12 justify-center items-center">
          <div className="w-10/12 md:w-8/12">
            <div className="main flex flex-col justify-center items-center bg-white p-4">
              <div
                className="img bg-no-repeat bg-cover w-20 h-20 rounded-full bg-center"
                style={{ backgroundImage: `url(${profilePicture})` }}
              ></div>
              <div className="w-11/12 sm:2-8/12 text-center md:w-6/12">
                <h1 className="font-semibold text-xl">{userData.name}</h1>
                <p>{userData.bio}</p>
              </div>
            </div>
          </div>
          <section
            className="md:w-10/12 sm:w-full w-full"
            aria-multiselectable="false"
          >
            <ul
              className="flex items-center border-b border-slate-200"
              role="tablist"
              ref={wrapperRef}
            >
              <li className="flex-1" role="presentation ">
                <button
                  className={`-mb-px  inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-t border-b-2 px-6 text-sm font-medium tracking-wide transition duration-300 hover:bg-yellow-50 hover:stroke-yellow-600 focus:bg-yellow-50 focus-visible:outline-none disabled:cursor-not-allowed ${
                    tabSelected.currentTab === 1
                      ? "border-yellow-500 stroke-yellow-500 text-yellow-500 hover:border-yellow-600  hover:text-yellow-600 focus:border-yellow-700 focus:stroke-yellow-700 focus:text-yellow-700 disabled:border-slate-500"
                      : "justify-self-center border-transparent stroke-slate-700 text-slate-700 hover:border-yellow-500 hover:text-yellow-500 focus:border-yellow-600 focus:stroke-yellow-600 focus:text-yellow-600 disabled:text-slate-500"
                  }`}
                  id="tab-label-1a"
                  role="tab"
                  aria-setsize="3"
                  aria-posinset="1"
                  tabIndex={`${tabSelected.currentTab === 1 ? "0" : "-1"}`}
                  aria-controls="tab-panel-1a"
                  aria-selected={`${
                    tabSelected.currentTab === 1 ? "true" : "false"
                  }`}
                  onClick={() =>
                    setTabSelected({ ...tabSelected, currentTab: 1 })
                  }
                >
                  <span>Your Posts</span>
                </button>
              </li>
              <li className="flex-1" role="presentation ">
                <button
                  className={`-mb-px inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-t border-b-2 px-6 text-sm font-medium tracking-wide transition duration-300 hover:bg-yellow-50 hover:stroke-yellow-600 focus:bg-yellow-50 focus-visible:outline-none disabled:cursor-not-allowed ${
                    tabSelected.currentTab === 2
                      ? "border-yellow-500 stroke-yellow-500 text-yellow-500 hover:border-yellow-600  hover:text-yellow-600 focus:border-yellow-700 focus:stroke-yellow-700 focus:text-yellow-700 disabled:border-slate-500"
                      : "justify-self-center border-transparent stroke-slate-700 text-slate-700 hover:border-yellow-500 hover:text-yellow-500 focus:border-yellow-600 focus:stroke-yellow-600 focus:text-yellow-600 disabled:text-slate-500"
                  }`}
                  id="tab-label-2a"
                  role="tab"
                  aria-setsize="3"
                  aria-posinset="2"
                  tabIndex={`${tabSelected.currentTab === 2 ? "0" : "-1"}`}
                  aria-controls="tab-panel-2a"
                  aria-selected={`${
                    tabSelected.currentTab === 2 ? "true" : "false"
                  }`}
                  onClick={() =>
                    setTabSelected({ ...tabSelected, currentTab: 2 })
                  }
                >
                  <span>Update Info</span>
                </button>
              </li>
              <li className="flex-1" role="presentation ">
                <button
                  className={`-mb-px inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-t border-b-2 px-6 text-sm font-medium tracking-wide transition duration-300 hover:bg-yellow-50 hover:stroke-yellow-600 focus:bg-yellow-50 focus-visible:outline-none disabled:cursor-not-allowed ${
                    tabSelected.currentTab === 3
                      ? "border-yellow-500 stroke-yellow-500 text-yellow-500 hover:border-yellow-600  hover:text-yellow-600 focus:border-yellow-700 focus:stroke-yellow-700 focus:text-yellow-700 disabled:border-slate-500"
                      : "justify-self-center border-transparent stroke-slate-700 text-slate-700 hover:border-yellow-500 hover:text-yellow-500 focus:border-yellow-600 focus:stroke-yellow-600 focus:text-yellow-600 disabled:text-slate-500"
                  }`}
                  id="tab-label-3a"
                  role="tab"
                  aria-setsize="3"
                  aria-posinset="3"
                  tabIndex={`${tabSelected.currentTab === 3 ? "0" : "-1"}`}
                  aria-controls="tab-panel-3a"
                  aria-selected={`${
                    tabSelected.currentTab === 3 ? "true" : "false"
                  }`}
                  onClick={() =>
                    setTabSelected({ ...tabSelected, currentTab: 3 })
                  }
                >
                  <span>Subscribtion</span>
                </button>
              </li>
            </ul>
            <div className="w-full">
              <div
                className={` py-4 w-full ${
                  tabSelected.currentTab === 1 ? "" : "hidden"
                }`}
                id="tab-panel-1a"
                aria-hidden={`${
                  tabSelected.currentTab === 1 ? "true" : "false"
                }`}
                role="tabpanel"
                aria-labelledby="tab-label-1a"
                tabIndex="-1"
              >
                <div className="w-full recipe-Container grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 md:gap-6 gap-4 px-10 pb-10">
                  {profilePosts.length === 0 && (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-gray-900 font-bold text-2xl">
                        No Posts to show
                      </span>
                    </div>
                  )}
                  {profilePosts.map((item) => (
                    <Link
                      to={`/post/${item._id}`}
                      key={item._id}
                      className="card z-1 "
                    >
                      <div className="flex flex-col overflow-hidden border-[0.5px] bg-white rounded shadow-lg text-slate-500 shadow-slate-200 sm:flex-row">
                        {/*  <!-- Image --> */}
                        <figure className="flex-1">
                          <div
                            className="w-full hidden sm:block h-full bg-no-repeat bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${findPicture(
                                "postsPicture",
                                item.postsPicture
                              )})`,
                            }}
                          ></div>
                          <img
                            src={findPicture("postsPicture", item.postsPicture)}
                            alt="card image"
                            className="object-cover sm:hidden block min-h-full aspect-auto"
                          />
                        </figure>
                        {/*  <!-- Body--> */}
                        <div className="flex-1 p-3 pb-6 sm:mx-6 sm:px-0">
                          <header className="flex gap-4 mb-3">
                            <div>
                              <h3 className="text-xl font-medium text-slate-700">
                                {item.name.length < 15
                                  ? item.name
                                  : item.name.slice(0, 15) + "..."}
                              </h3>
                              <p className="text-sm text-slate-400">
                                {" "}
                                {formatDate(item.updatedAt)}
                              </p>
                            </div>
                          </header>
                          <p className="min-h-12">
                            {item.description.slice(0, 60)}...
                          </p>
                          <div className="btn mt-4 flex gap-1  ">
                            <Link
                              to={`/recipe?id=${item._id}`}
                              className="bg-yellow-400 p-2 text-white rounded-md"
                            >
                              View
                            </Link>
                            <Link
                              to={`/updatePost?id=${item._id}`}
                              className="bg-emerald-400 p-2 text-white rounded-md"
                            >
                              Edit
                            </Link>
                            <Link
                              to={`/deletePost?id=${item._id}`}
                              className="bg-red-400 p-2 text-white rounded-md"
                            >
                              Delete
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div
                className={`px-6 py-4 ${
                  tabSelected.currentTab === 2 ? "" : "hidden"
                }`}
                id="tab-panel-2a"
                aria-hidden={`${
                  tabSelected.currentTab === 2 ? "true" : "false"
                }`}
                role="tabpanel"
                aria-labelledby="tab-label-2a"
                tabIndex="-1"
              >
                <form
                  onSubmit={handleSubmit}
                  className="bg-transparent   rounded-xl p-6  mx-auto w-full"
                >
                  <div
                    className="relative mb-6 mt-2"
                    onClick={() => setImageClicked(!imageClicked)}
                  >
                    <input
                      id="profilePicture"
                      name="profilePicture"
                      onChange={handleImageChange}
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                    <label
                      htmlFor="profilePicture"
                      className="relative flex cursor-pointer flex-col items-center gap-4 rounded border border-dashed border-slate-300 px-3 py-6 text-center text-sm font-medium transition-colors"
                    >
                      <span className="inline-flex h-12 items-center justify-center self-center rounded-full bg-slate-100/70 px-3 text-slate-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-label="File input icon"
                          role="graphics-symbol"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                          />
                        </svg>
                      </span>
                      <span className="text-slate-500">
                        {imageFileUrl ? "" : "Update"}
                        <span className="text-yellow-500">
                          {" "}
                          {imageFileUrl
                            ? "Image Selected press update to save"
                            : "Profile Image"}{" "}
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="relative my-6">
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="your name"
                      minLength={10}
                      value={formData.name}
                      onChange={handleChange}
                      className="peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-slate-500  outline-none transition-all autofill:bg-white   focus:border-yellow-500 focus:outline-none  focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                      required
                    />
                  </div>

                  <div className="relative my-6">
                    <textarea
                      id="bio"
                      type="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Your bio"
                      rows="3"
                      className="relative w-full px-4 py-2 text-sm  transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-yellow-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    ></textarea>
                  </div>
                  <div className="btn-section mb-1 flex flex-col justify-center items-center">
                    <button
                      className="bg-yellow-400 p-2 w-full rounded-md text-white"
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                  <small>
                    Your forgot your password?{" "}
                    <Link to="/signin" className="text-yellow-500 ">
                      reset password
                    </Link>
                  </small>
                </form>
              </div>
              <div
                className={`px-6 py-4 ${
                  tabSelected.currentTab === 3 ? "" : "hidden"
                }`}
                id="tab-panel-3a"
                aria-hidden={`${
                  tabSelected.currentTab === 3 ? "true" : "false"
                }`}
                role="tabpanel"
                aria-labelledby="tab-label-3a"
                tabIndex="-1"
              >
                <p>
                  Even though there is no certainty that the expected results of
                  our work will manifest, we have to remain committed to our
                  work and duties; because, even if the results are slated to
                  arrive, they cannot do so without the performance of work.
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="mt-20">
          Please{" "}
          <Link to="/signin" className="text-yellow-400">
            {" "}
            Sign in
          </Link>
        </div>
      )}
    </>
  );
};

export default Profile;
