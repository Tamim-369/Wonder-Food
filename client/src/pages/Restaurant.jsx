import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Restaurant = ({ getUser, getPosts, findPicture }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser(userId);
        setUserData(user);
        const pic = await findPicture("profilePicture", user.profilePicture);
        setProfilePicture(pic);

        // Fetch posts only if the user is available
        if (user) {
          const userPosts = await getPosts(user.email);
          setPosts(userPosts);
        }

        if (localStorage.getItem("token")) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error as needed
      }
    };

    fetchData();
  }, [getUser, getPosts, findPicture, userId]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
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
  return (
    <div className="mt-24">
      <div className="main flex flex-col justify-center items-center bg-white p-4">
        <div
          className="img bg-no-repeat bg-cover w-20 h-20 rounded-full bg-center"
          style={{
            backgroundImage: `url(${profilePicture})`,
          }}
        />
        <div className="w-11/12 sm:2-8/12 text-center md:w-6/12">
          <h1 className="font-semibold text-xl">{userData.name}</h1>
          <p>{userData.bio}</p>
        </div>
      </div>
      <div className="recipes border-t-2 pt-6">
        <div className="recipe-Container grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:gap-6 gap-4 px-10 pb-10">
          {posts.map((item) => (
            <div key={item._id} className="card z-1 ">
              <div className="flex flex-col overflow-hidden border-[0.5px] bg-white rounded shadow-lg text-slate-500 shadow-slate-200 sm:flex-row">
                {/*  <!-- Image --> */}
                <figure className="flex-1">
                  <div
                    className="w-full h-full bg-no-repeat bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${findPicture(
                        "postsPicture",
                        item.postsPicture
                      )})`,
                    }}
                  ></div>
                  {/* <img
                    src={findPicture("postsPicture", item.postsPicture)}
                    alt="card image"
                    className="object-cover min-h-full aspect-auto"
                  /> */}
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
                  <p>{item.description.slice(0, 60)}...</p>
                  <div className="btn mt-4">
                    <Link
                      to={`/recipe?id=${item._id}`}
                      className="bg-yellow-400 p-2 text-white rounded-md"
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
    </div>
  );
};

export default Restaurant;
