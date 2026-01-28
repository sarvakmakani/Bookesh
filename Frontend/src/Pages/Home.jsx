import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import { AiOutlineEdit, AiFillStar } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    axios
      .get("http://localhost:5555/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          page,
          limit: 3,
        },
      })
      .then((res) => {
        setBooks(res.data.data);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [search, page, token]);

  const handleBookmark = async (id) => {
    try {
      await axios.put(
        `http://localhost:5555/books/${id}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const res = await axios.get("http://localhost:5555/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { search, page, limit: 3 },
      });

      setBooks(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-3xl font-bold text-sky-700">My Books</h1>

          <Link to="/books/create">
            <button className="mt-3 md:mt-0 flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow">
              <MdOutlineAddBox className="text-xl" />
              Add Book
            </button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-1/3 px-4 py-2 rounded-xl border border-sky-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        {/* Content */}
        {loading ? (
          <Spinner />
        ) : books.length === 0 ? (
          <div className="text-center text-gray-500 mt-24">
            <p className="text-2xl font-semibold">No books found </p>
            <p className="mt-2">Start by adding your first book</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-800">
                      {book.title}
                    </h2>

                    <button onClick={() => handleBookmark(book._id)}>
                      <AiFillStar
                        className={`text-2xl ${
                          book.bookmarked
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-gray-600 mt-1">{book.author}</p>
                  <p className="text-sm text-gray-500">
                    Published: {book.publishYear}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      book.status === "read"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {book.status}
                  </span>

                  <p className="text-gray-700 mt-3 line-clamp-3">
                    {book.summary}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link to={`/books/details/${book._id}`}>
                    <BsInfoCircle className="text-2xl text-green-600 hover:scale-110 transition" />
                  </Link>
                  <Link to={`/books/edit/${book._id}`}>
                    <AiOutlineEdit className="text-2xl text-yellow-500 hover:scale-110 transition" />
                  </Link>
                  <Link to={`/books/delete/${book._id}`}>
                    <MdOutlineDelete className="text-2xl text-red-600 hover:scale-110 transition" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-white shadow rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-semibold text-gray-700">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-white shadow rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
