import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const UpdatePost = ({ getPost, findPicture }) => {
  const [postInfo, setPostInfo] = useState({});
  const [formData, setFormData] = useState({});
  const [imageFileUrl, setImageFileUrl] = useState();
  const [imageFile, setImageFile] = useState();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get("id");

  const getPostInfo = async (id) => {
    const post = await getPost(id);
    setPostInfo(post);
    setFormData(post); // Initialize formData with postInfo
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name } = event.target;

    if (name === "postsPicture") {
      const file = event.target.files[0]; // Get the first file from the FileList

      // Update the imageFile state with the selected file
      setImageFile(file);

      // Update the imageFileUrl state with the URL of the selected file
      setImageFileUrl(URL.createObjectURL(file));
    } else {
      const { value } = event.target;

      // Update the formData state with the new value
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Create FormData object to hold form data
      const formDataToSend = new FormData();

      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      if (imageFile) {
        formDataToSend.append("postsPicture", imageFile);
      }

      // Send PUT request to server endpoint using Fetch API
      const response = await fetch(`/api/post/getpost/${postId}`, {
        method: "PUT",
        body: formDataToSend,
      });

      // Parse response body as JSON
      const responseData = await response.json();

      // Handle response from server
      console.log("Server response:", responseData);

      window.location.href = `/recipe?id=${postId}`;
    } catch (error) {
      // Handle error if request fails
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    getPostInfo(postId);
  }, [postId]); // Add postId as a dependency to fetch postInfo when it changes

  return (
    <div className="mt-[75px] flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Update Post</h1>
      <div className="w-full sm:w-11/12 md:w-8/12 my-2 bg-white  flex justify-center items-center  p-2 rounded-xl">
        <form
          onSubmit={handleSubmit}
          className="w-full mx-auto flex flex-col justify-center items-center"
        >
          <div className="my-2 w-full mx-auto text-center">
            <input
              type="text"
              name="name"
              maxLength={50}
              onChange={handleChange}
              value={formData.name}
              className="w-10/12 mx-auto rounded-md bg-gray-100 border-2 focus:outline-none p-2"
              placeholder="Enter recipe name"
              required
            />
          </div>
          <div className="my-2 w-full mx-auto text-center">
            <textarea
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              className="w-10/12 mx-auto rounded-md bg-gray-100 border-2 focus:outline-none p-2"
              placeholder="Enter description"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="my-2 relative w-10/12 mx-auto text-center">
            <input
              id="postsPicture"
              name="postsPicture"
              onChange={handleChange}
              type="file"
              accept="image/*"
              className="hidden"
            />
            <label
              htmlFor="postsPicture"
              className="relative flex cursor-pointer flex-col items-center gap-4 rounded border border-dashed border-slate-300 px-3 py-6 text-center text-sm font-medium transition-colors"
            >
              <img
                src={
                  imageFileUrl ||
                  (postInfo.postsPicture
                    ? findPicture("postsPicture", formData.postsPicture)
                    : "")
                }
                alt="Preview"
              />
            </label>
          </div>
          <div className="my-2 w-full mx-auto text-center">
            <textarea
              name="instructions"
              type="text"
              value={formData.instructions}
              onChange={handleChange}
              className="w-10/12 mx-auto rounded-md bg-gray-100 border-2 focus:outline-none p-2"
              placeholder="Instructions"
              rows="6"
              required
            ></textarea>
          </div>
          <div className="my-2 w-full mx-auto text-center">
            <textarea
              name="ingredients"
              type="text"
              value={formData.ingredients}
              onChange={handleChange}
              className="w-10/12 mx-auto rounded-md bg-gray-100 border-2 focus:outline-none p-2"
              placeholder="Ingredients"
              rows="6"
              required
            ></textarea>
          </div>
          {/* Submit button */}
          <div className="mt-0 mb-4 w-full mx-auto text-center">
            <button
              type="submit"
              className="bg-yellow-500 p-2 rounded-md text-white"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
