import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DeletePost = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get("id");
  const deletepost = async () => {
    const response = await fetch(`/api/post/getpost/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      alert("POst Deleted succesfully");
      window.location.href = "/profile";
    }
  };
  useEffect(() => {
    deletepost();
  }, []);

  return <div></div>;
};

export default DeletePost;
