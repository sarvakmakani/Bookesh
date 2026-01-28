import React, { useState, useEffect } from "react";
import BackButton from "../components/backButton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

const UpdateBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("unread");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    axios
      .get(`https://bookesh-backend.onrender.com/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTitle(res.data.title);
        setAuthor(res.data.author);
        setPublishYear(res.data.publishYear);
        setSummary(res.data.summary);
        setStatus(res.data.status);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  const handleEditBook = () => {
    const data = { title, author, publishYear, summary, status };

    setLoading(true);
    axios
      .put(`https://bookesh-backend.onrender.com/books/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Book updated successfully", { variant: "success" });
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error updating book", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <BackButton />

      <h1 className="text-4xl font-bold text-center text-sky-600 my-6">
        Update Book
      </h1>

      {loading && <Spinner />}

      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6 border border-sky-200">
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">
            Book Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
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
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        {/* Publish Year */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">
            Publish Year
          </label>
          <input
            type="number"
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
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
            rows={4}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>

        <button
          onClick={handleEditBook}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg font-semibold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UpdateBook;
