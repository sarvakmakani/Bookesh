import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/backButton";
import Spinner from "../components/Spinner";
import axios from "axios";

const DeleteBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handleDeleteBook = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/books/${id}`)
      .then(() => {
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-200 p-6">
      <BackButton />

      <h1 className="text-4xl font-bold text-center text-red-600 my-6">
         Delete Book
      </h1>

      {loading && <Spinner />}

      <div className="max-w-lg mx-auto bg-white shadow-2xl rounded-2xl p-6 border border-red-200 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Are you sure you want to delete this book?
        </h3>

        <p className="text-gray-500 mb-6">
          This action cannot be undone.
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg shadow"
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteBook}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBook;
