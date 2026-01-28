import React, { useState } from "react";
import BackButton from "../components/backButton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const CreateBooks = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveBook = () => {
    const data = { title, author, publishYear,summary };

    setLoading(true);
    axios
      .post("https://bookesh-backend.onrender.com/books", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Book created successfully", { variant: "success" });
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error creating book", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-6">
      <BackButton />

      <h1 className="text-4xl font-bold text-center text-sky-700 my-6">
        Create New Book
      </h1>

      {loading && <Spinner />}

      <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-6 border border-sky-200">
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">
            Book Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        {/* Author */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">
            Author Name
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        {/* Publish Year */}
        <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-1">
            Publish Year
          </label>
          <input
            type="number"
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
            placeholder="Enter year"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        {/* Summary */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">
            Summary
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Enter short summary of the book"
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 
      focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSaveBook}
          className="w-full bg-sky-600 hover:bg-sky-700 
            text-white py-2 rounded-lg font-semibold shadow-md transition"
        >
          Save Book
        </button>
      </div>
    </div>
  );
};

export default CreateBooks;
