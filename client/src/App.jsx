import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Recipe from "./pages/Recipe";
import AllRestaurants from "./pages/AllRestaurants";
import Restaurant from "./pages/Restaurant";
import Recipes from "./pages/Recipes";
import { useEffect, useState } from "react";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import ForgetPassword from "./pages/ForgetPassword";
import CreatePost from "./pages/CreatePost";
import Verify from "./pages/Verify";
import VerifySent from "./pages/VerifySent";
import UpdatePost from "./pages/UpdatePost";
import DeletePost from "./pages/DeletePost";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [userData, setUserData] = useState({});
  const findPicture = (folder, name) => {
    return `http://${import.meta.env.VITE_SERVER_URL}/${folder}/${name}`;
  };
  const getPost = async (userId) => {
    const response = await fetch(`/api/post/getpost/${userId ? userId : ""}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  };
  const getPosts = async (userEmail) => {
    if (userEmail) {
      const response = await fetch(
        `/api/post/getpostbyemail/${userEmail ? userEmail : ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.json();
    } else {
      const response = await fetch(`/api/post/getpost/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    }
  };

  const getUser = async (id) => {
    if (id) {
      const user = await fetch(`/api/users/userid/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userData = await user.json();
      setUserData(userData);
      setProfilePicture(findPicture("profilePicture", userData.profilePicture));
      return userData;
    } else {
      const userEmail = localStorage.getItem("email");
      const user = await fetch(`/api/users/user/${userEmail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userData = await user.json();
      setUserData(userData);
      setProfilePicture(findPicture("profilePicture", userData.profilePicture));
      return userData;
    }
  };
  const getUserByEmail = async (email) => {
    const user = await fetch(`/api/users/user/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const foundUserData = await user.json();
    setProfilePicture(findPicture("profilePicture", userData.profilePicture));
    return foundUserData;
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <Navbar
        userData={userData}
        findPicture={findPicture}
        profilePicture={profilePicture}
      />
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Recipes findPicture={findPicture} getPosts={getPosts} />
            ) : (
              <SignIn findPicture={findPicture} />
            )
          }
        />
        <Route path="/signin" element={<SignIn findPicture={findPicture} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verifysent" element={<VerifySent />} />
        <Route
          path="/updatePost"
          element={<UpdatePost getPost={getPost} findPicture={findPicture} />}
        />
        <Route
          path="/deletePost"
          getPost={getPost}
          findPicture={findPicture}
          element={<DeletePost />}
        />

        <Route
          path="/recipe"
          element={
            <Recipe
              getPost={getPost}
              getUser={getUser}
              findPicture={findPicture}
              getUserByEmail={getUserByEmail}
            />
          }
        />
        <Route
          path="/allrestaurants"
          element={<AllRestaurants findPicture={findPicture} />}
        />
        <Route
          path="/restaurant"
          element={
            <Restaurant
              getUser={getUser}
              findPicture={findPicture}
              getPosts={getPosts}
              getUserByEmail={getUserByEmail}
            />
          }
        />
        <Route path="/createPost" element={<CreatePost />} />
        <Route
          path="/profile"
          element={
            <Profile
              profilePicture={profilePicture}
              userData={userData}
              getPosts={getPosts}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              findPicture={findPicture}
              getUser={getUser}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
