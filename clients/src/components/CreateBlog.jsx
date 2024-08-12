import 'react-quill/dist/quill.snow.css'; // Import Quill styles
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

import  { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import ReactQuill from 'react-quill';
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { createblog } from '../Redux/Blog.jsx';
import updateImage from "./update.jpg";

function CreateBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    title: "",
    description: "",
    thumbnail: null,
    previewImage: "",
  });

  


  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  const handleEditorChange = (value) => {
    setUserInput({
      ...userInput,
      description: value,
    });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.title || !userInput.description ) {
      toast.error("All fields are mandatory");
      return;
    }

 // Save image and get URL


    const response = await dispatch(createblog({
      title: userInput.title,
      description: userInput.description,
      // Use the returned image URL
    }));

    if (response?.payload?.success) {
      navigate("/updates");
      setUserInput({
        title: "",
        description: "",
        thumbnail: null,
        previewImage: "",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-full" style={{ backgroundImage: `url(${updateImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <form
        onSubmit={onFormSubmit}
        className="flex flex-col justify-center gap-5 rounded-lg p-4 text-blue-500 bg-blue-100 w-[700px] my-10"
      >
        <Link to="/" className="absolute top-8 text-2xl text-accent cursor-pointer">
          <AiOutlineArrowLeft />
        </Link>

        <h1 className="text-center text-2xl font-bold">Create New Blog</h1>
        

        <input
          type="text"
          name="title"
          value={userInput.title}
          onChange={handleUserInput}
          placeholder="Question"
          className="border rounded p-2 bg-white text-blue-500"
        />

        <ReactQuill
          value={userInput.description}
          onChange={handleEditorChange}
          placeholder="Answer"
          className="border rounded p-2 bg-white text-blue-500"
        />

        <button type="submit" className="bg-blue-500 p-2 rounded text-white">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
