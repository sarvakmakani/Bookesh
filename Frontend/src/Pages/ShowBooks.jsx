import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import BackButton from "../components/backButton";
import axios from "axios";
import { AiFillStar } from "react-icons/ai";

const ShowBooks = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { id } = useParams();

  const token = localStorage.getItem("token");

  const fetchBook = async () => {
    setLoading(true);
    const res = await axios.get(`https://bookesh-backend.onrender.com/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBook(res.data.data || res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchBook();
  }, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    await axios.post(
      `https://bookesh-backend.onrender.com/${id}/comments`,
      { text: commentText },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCommentText("");
    fetchBook();
  };

  const handleDeleteComment = async (commentId) => {
    await axios.delete(
      `https://bookesh-backend.onrender.com/${id}/comments/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchBook();
  };

  if (loading) return <Spinner />;
  if (!book) return <p>No book found</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <BackButton />

      <h1 className="text-4xl font-bold text-center text-sky-600 my-6">
        Book Details
      </h1>

      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-sky-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{book.title}</h2>
            <p className="text-gray-600">{book.author}</p>
            <p className="text-sm text-gray-500">
              Published: {book.publishYear}
            </p>
          </div>

          <AiFillStar
            className={`text-3xl ${
              book.bookmarked ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        </div>

        {/* Status */}
        <span
          className={`inline-block mb-4 px-3 py-1 rounded-full text-sm font-semibold ${
            book.status === "read"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {book.status}
        </span>

        {/* Summary */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-1">Summary</h3>
          <p className="text-gray-700">{book.summary}</p>
        </div>

        {/* COMMENTS SECTION */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Comments</h3>

          {/* Add comment */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              onClick={handleAddComment}
              className="bg-sky-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>

          {/* List comments */}
          {book.comments && book.comments.length > 0 ? (
            book.comments.map((c) => (
              <div
                key={c._id}
                className="border rounded p-3 mb-2 flex justify-between"
              >
                <span>{c.text}</span>
                <button
                  onClick={() => handleDeleteComment(c._id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet</p>
          )}
        </div>

        {/* Dates */}
        <div className="mt-6 text-sm text-gray-500">
          <p>Created: {new Date(book.createdAt).toLocaleString()}</p>
          <p>Updated: {new Date(book.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowBooks;


// import React from "react";
// import { useParams } from "react-router-dom";
// import Spinner from "../components/Spinner";
// import backButton from "../components/backButton";
// import { useState } from "react";
// import { useEffect } from "react";
// import axios from "axios";

// const ShowBooks = () => {
//   const [book, setBook] = useState({});
//   const [loading, setLoading] = useState(false);
//   const { id } = useParams();

//   useEffect(() => {
//     setLoading(true);
//     axios
//       .get(`http://localhost:5555/books/${id}`)
//       .then((res) => {
//         setBook(res.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.log(error);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className=" p-4">
//       <backButton />
//       <h1 className="text-3xl my-4">Show Books</h1>
//       {loading ? (
//         <Spinner />
//       ) : (
//         <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
//           <div className="my-4">
//             <span className="text-xl mr-4 text-gray-500">Id: </span>
//             <span>{book._id}</span>
//           </div>
//           <div className="my-4">
//             <span className="text-xl mr-4 text-gray-500">Title: </span>
//             <span>{book.title}</span>
//           </div>
//           <div className="my-4">
//             <span className="text-xl mr-4 text-gray-500">Author: </span>
//             <span>{book.author}</span>
//           </div>
//           <div className="my-4">
//             <span className="text-xl mr-4 text-gray-500">Publish Year: </span>
//             <span>{book.publishYear}</span>
//           </div>
//           <div className="my-4">
//             <span className="text-xl mr-4 text-gray-500">Create Time: </span>
//             <span>{new Date(book.createdAt).toString()}</span>
//           </div>
//           <div className="my-4">
//             <span className="text-xl mr-4 text-gray-500">Last Update Time: </span>
//             <span>{new Date(book.updatedAt).toString()}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowBooks;
