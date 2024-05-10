import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllRestaurants = ({ findPicture }) => {
  const [users, setUsers] = useState([]);
  const findUsers = async () => {
    try {
      const response = await fetch("api/users/user/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    findUsers();
  }, []);

  return (
    <div className="flex flex-col mt-24 justify-center items-center">
      {users.map((user) => (
        <div
          key={user._id}
          className="w-10/12 my-2 bg-white border-[1px] flex flex-col md:flex-row justify-center items-center shadow-lg p-2 rounded-xl"
        >
          <div className="img w-5/12 md:w-2/12 p-4 flex-1">
            <img
              className="w-full rounded-full"
              src={`${findPicture("profilePicture", user.profilePicture)}`}
              alt=""
              srcset=""
            />
          </div>
          <div className="info w-full text-center md:text-left md:w-10/12 md:py-4">
            <Link
              to={`/restaurant?id=${user._id}`}
              className="text-xl  font-semibold md:pr-2 text-black border-b-2 border-yellow-400 hover:border-b-2 hover:border-yellow-400"
            >
              {user.name}
            </Link>
            <p>{user.bio}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllRestaurants;
