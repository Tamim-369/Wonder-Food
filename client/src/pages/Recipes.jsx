import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Recipes = ({ getPosts, findPicture }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [profilePicture, setProfilePicture] = useState("");
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");

  const getSetPosts = async () => {
    const posts = await getPosts();
    if (posts) {
      const sortedpPosts = posts.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      setPosts(sortedpPosts);
    } else {
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getSetPosts();

      setIsLoggedIn(true);
    }
  }, []);
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
  const filteredCards = posts.filter((post) =>
    post.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="mt-32">
      <div className="w-full md:w-8/12 sm:w-10/12  lg:w-6/12 mx-auto text-center pb-20 flex flex-col justify-center items-center">
        <h1 className="text-3xl">Welcome back to </h1>
        <span className="font-semibold text-yellow-500 text-5xl flex">
          <span className="text-yellow-600">W</span>
          onderFood
        </span>

        <h1 className="text-3xl">
          Discover and share{" "}
          <span className="text-4xl font-semibold text-yellow-500 ">
            Amazing recipes
          </span>{" "}
          around the world
        </h1>
        {/* <Link
          className="text-lg font-semibold text-white my-3 p-3 rounded-xl bg-yellow-400 border-[1px] shadow-lg"
          to={`/createPost`}
        >
          Share A Recipe
        </Link> */}
      </div>
      <div className="flex mx-auto justify-center items-center md:w-5/12 sm:8/12 w-10/12">
        <div className="search w-full pb-28">
          <input
            type="text"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="border-none w-full p-3 bg-gray-50 border  shadow-lg  rounded-lg  focus:outline-none "
          />
        </div>
      </div>
      <div className="recipe-Container grid grid-cols-1 lg:grid-cols-2 md:gap-6 gap-4 px-10 pb-10">
        {filteredCards.map((item) => (
          <div key={item._id} className="card z-1 ">
            <div className="flex sm:flex-row overflow-hidden border-[0.5px] bg-white rounded shadow-lg text-slate-500 shadow-slate-200 flex-col">
              {/*  <!-- Image --> */}
              <figure className="sm:flex-1">
                <div
                  className="w-full hidden sm:block min-h-full bg-no-repeat bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${item.postsPicture})`,
                  }}
                ></div>
                <img
                  src={findPicture("postsPicture", item.postsPicture)}
                  alt="card image"
                  className="object-cover sm:hidden block min-h-full aspect-auto"
                />
              </figure>
              {/*  <!-- Body--> */}
              <div className="sm:flex-1  p-3 pb-6 sm:mx-6 sm:px-0">
                <header className="flex gap-4 mb-3">
                  <div>
                    <h3 className="text-xl font-medium text-slate-700">
                      {item.name.length < 30
                        ? item.name
                        : item.name.slice(0, 30) + "..."}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {" "}
                      {formatDate(item.updatedAt)}
                    </p>
                  </div>
                </header>
                <p className="md:min-h-16">
                  {item.description.slice(0, 50)}...
                </p>
                <div className="btn mt-2">
                  <Link
                    to={`/recipe?id=${item._id}`}
                    className="bg-yellow-400 p-2 text-white rounded-md border-[1px] shadow-lg"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
