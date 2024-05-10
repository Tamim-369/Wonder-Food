import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Recipe = ({ getPost, findPicture, getUser, getUserByEmail }) => {
  const [openEdit, setOpenEdit] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [postsPicture, setPostsPicture] = useState("");
  const [postData, setPostData] = useState({});
  const [authorData, setAuthorData] = useState({});
  const [showMore, setShowMore] = useState("");
  const navigate = useNavigate();
  const [showLess, setShowLess] = useState("");
  const [commentData, setCommentData] = useState({});
  const [comments, setComments] = useState([]);
  const [newCommentData, setNewCommentData] = useState();
  const [commentSubmitted, setcommentSubmitted] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postDataResponse = await getPost(id);
        setPostData(postDataResponse);

        const authorDataResponse = await getUserByEmail(
          postDataResponse.userEmail
        );
        setAuthorData(authorDataResponse);
      } catch (error) {
        console.error("Error fetching post data:", error);
        // Handle error as needed
      }
    };

    fetchData();
  }, [id, getPost, getUserByEmail]);

  useEffect(() => {
    const fetchPicture = async () => {
      try {
        const picture = await findPicture(
          "postsPicture",
          postData.postsPicture
        );
        setPostsPicture(picture);
      } catch (error) {
        console.error("Error fetching post picture:", error);
        // Handle error as needed
      }
    };

    fetchPicture();
  }, [postData.postsPicture, findPicture]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/comment/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: commentData.comment,
          postId: id,
          userEmail: localStorage.getItem("email"),
        }),
      });
      const data = await response.json();
      setcommentSubmitted(true);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const deleteComment = async (id) => {
    try {
      const response = await fetch(`/api/comment/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const updateComment = async (event, id) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/comment/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: newCommentData.comment,
        }),
      });
      const data = await response.json();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCommentData({ ...commentData, [name]: value });
  };
  const getComments = async () => {
    try {
      const commentsResponse = await fetch(`/api/comment/get/${id}`);
      const commentsData = await commentsResponse.json();

      // Fetch commenter data for each comment
      const commentsWithCommenterData = await Promise.all(
        commentsData.map(async (comment) => {
          const commenter = await getCommenter(comment.userEmail);
          const data = { ...comment, commenter };

          return data;
        })
      );

      setComments(commentsWithCommenterData);
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Handle error as needed
    }
  };
  useEffect(() => {
    getComments();
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);
  const getCommenter = async (email) => {
    const res = await getUserByEmail(email);
    return res;
  };
  const handleEdit = (id) => {
    updateComment(id);
    setOpenEdit(!openEdit);
  };
  const handleCommentChange = (event) => {
    const { name, value } = event.target;
    setNewCommentData({ ...newCommentData, [name]: value });
  };
  return (
    <div className=" mt-20 ">
      <div className="md:mt-24 pt-10 w-full md:w-10/12 mx-auto pb-10 bg-white ">
        <img
          src={postData.postsPicture}
          className=" w-full px-4 sm:w-10/12 md:w-10/12 md:h-8/12 sm:mx-auto"
          alt=""
        />

        <div className="info border-t-2 pt-5 mt-2 md:mt-10 px-4 w-full  sm:w-10/12 md:w-8/12 sm:mx-auto">
          <Link
            to={`/restaurant?id=${authorData._id}`}
            className=" text-xl font-bold border-b-2 border-yellow-400 "
          >
            {authorData.name}
          </Link>

          <h1 className=" text-xl font-bold mt-4">{postData.name}</h1>
          <p>{postData.description}</p>
          <div className="recipe w-full">
            <div className="instructions mt-2 md:mt-10 px-4 w-full  ">
              <h1 className=" text-xl font-bold">Instructions</h1>
              <p className="whitespace-pre-wrap">{postData.instructions}</p>
            </div>
            <div className="ingredients mt-2 md:mt-10 px-4 w-full  ">
              <h1 className=" text-xl font-bold">Ingredients</h1>
              <p className="whitespace-pre-wrap	">{postData.ingredients}</p>
            </div>
          </div>
        </div>
      </div>
      {isLoggedIn && (
        <div className="comment-section border-t-[1px] mx-auto md:w-8/12 rounded-xl px-4 pb-2 mb-10  ">
          <div className="form mt-4 w-full mb-2  p-4 mx-auto ">
            <form className="w-full" onSubmit={handleCommentSubmit}>
              <div class="relative">
                <textarea
                  id="id-01"
                  type="text"
                  onChange={handleChange}
                  value={commentData.value}
                  name="comment"
                  placeholder="Write your message"
                  rows="3"
                  class="relative w-full px-4 py-2 text-sm placeholder-transparent transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white  focus:border-yellow-500 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  required
                ></textarea>
                <label
                  for="id-01"
                  class="cursor-text peer-focus:cursor-default absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-yellow-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                >
                  Comment
                </label>
                <div className="btn">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="   rounded-lg  mb-10   pb-10   flex flex-col justify-center items-center ">
            {comments.map((item) => {
              return (
                <div
                  key={item._id}
                  className="w-full flex flex-col justify-center items-center"
                >
                  <div
                    key={item._id}
                    className="comment w-10/12 rounded-lg bg-white p-5 my-2 flex justify-center items-center"
                  >
                    <div className="img w-2/12 mr-2 h-2/12 rounded-full flex flex-col justify-start items-start self-start">
                      <img
                        src={`${item.commenter.profilePicture}`}
                        className="w-full md:w-10/12 rounded-full "
                        alt=""
                      />
                    </div>
                    <div className="comment flex  w-10/12 ">
                      <div className="main flex flex-col">
                        <h1>
                          <Link
                            to={`/restaurant?id=${item.commenter._id}`}
                            className="font-bold border-b-[2px] border-yellow-400"
                          >
                            {item.commenter.name}
                          </Link>
                        </h1>
                        <span>
                          {item.comment.length > 70 && showMore !== item._id
                            ? item.comment.slice(0, 100) + "..."
                            : item.comment}

                          {item.comment.length > 70 && (
                            <button
                              type="button"
                              className="font-semibold"
                              onClick={() => setShowMore(item._id)}
                            >
                              {showMore === item._id ? "" : "Show More"}
                            </button>
                          )}
                        </span>
                      </div>
                      {item.commenter.email ==
                        localStorage.getItem("email") && (
                        <div className="flex mx-auto justify-center items-center gap-1">
                          <button
                            className="p-2 rounded-md bg-red-700 shadow-lg text-white"
                            onClick={() => deleteComment(item._id)}
                          >
                            <MdDelete />
                          </button>
                          <button
                            className="p-2 rounded-md bg-green-700 shadow-lg text-white"
                            onClick={() => {
                              if (openEdit === item._id) {
                                setOpenEdit("");
                              } else {
                                setOpenEdit(item._id);
                              }
                            }}
                          >
                            <FaRegEdit />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {openEdit === item._id && (
                    <form
                      onSubmit={(event) => {
                        updateComment(event, item._id);
                      }}
                      className="md:w-10/12 sm:w-11/12 w-full px-10"
                    >
                      <textarea
                        name="comment"
                        onChange={handleCommentChange}
                        className="w-full p-2 rounded-lg focus:outline-none bg-gray-50 border-2"
                        id=""
                        // value={newCommentData.comment}
                      >
                        {item.comment}
                      </textarea>
                      <button
                        className="bg-green-700  text-white font-bold py-2 px-4 rounded"
                        type="submit"
                      >
                        Edit
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipe;
