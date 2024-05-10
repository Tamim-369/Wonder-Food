import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructions: "",
    ingredients: "",
    postsPicture: null,
  });
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  if (!userEmail) {
    alert("Please sign in to create a post");
    window.location.href = "/signin";
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("instructions", formData.instructions);
      data.append("ingredients", formData.ingredients);
      data.append("postsPicture", formData.postsPicture);
      data.append("userEmail", userEmail);

      const response = await fetch(`/api/post/createPost/${userEmail}`, {
        method: "POST",
        body: data, // Send FormData object instead of JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const recipeData = await response.json();
      alert("Post Created Succesfully");

      navigate(`/recipe?id=${recipeData._id}`);
    } catch (error) {
      setError(error.message);
      console.error("There was a problem with the post request:", error);
    }
  };
  const handleChange = (event) => {
    event.preventDefault();
    const { name } = event.target;

    if (name === "postsPicture") {
      const file = event.target.files[0]; // Get the first file from the FileList
      setFormData({ ...formData, [name]: file });
    } else {
      const { value } = event.target;
      setFormData({ ...formData, [name]: value });
    }
  };
  return (
    <div className="mt-[75px] flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Create Post</h1>
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
              className="w-10/12 mx-auto rounded-md bg-gray-100 border-2 focus:outline-none p-2"
              placeholder="Enter recipe name"
              required
            />
          </div>
          <div className="my-2 w-full mx-auto text-center">
            <textarea
              name="description"
              type="text"
              onChange={handleChange}
              className="w-10/12 mx-auto rounded-md bg-gray-100 border-2 focus:outline-none p-2"
              placeholder="Enter description"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="my-2 relative w-10/12 mx-auto text-center">
            <input
              id="id-file01"
              type="file"
              onChange={handleChange}
              name="postsPicture"
              className="peer relative w-full rounded cursor-pointer border-gray-100 px-4 py-2.5 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-gray-50 focus:outline-none border-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 [&::file-selector-button]:hidden"
              required
            />
            <label
              for="id-file01"
              className="absolute -top-2 left-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all before:absolute before:left-0 before:top-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2  peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-yellow-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-gray-50"
            >
              {" "}
              Recipe Image{" "}
            </label>
          </div>
          <div className="my-2 w-full mx-auto text-center">
            <textarea
              name="instructions"
              type="text"
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
              onChange={handleChange}
              className="w-10/12 mx-auto rounded-md bg-gray-100 border-2 focus:outline-none p-2"
              placeholder="Ingredients"
              rows="6"
              required
            ></textarea>
          </div>
          <div className="mt-0 mb-4 w-full mx-auto text-center">
            <button
              type="submit"
              className="bg-yellow-500 p-2 rounded-md text-white border-[1px] shadow-lg"
            >
              Post Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
