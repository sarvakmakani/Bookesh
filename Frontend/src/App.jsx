import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateBooks from "./Pages/CreateBooks";
import ShowBooks from "./Pages/ShowBooks";
import Home from "./Pages/Home";
import DeleteBook from "./Pages/DeleteBook";
import UpdateBook from "./Pages/UpdateBook";
import Login from "./Pages/Login";
const App = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/books/create" element={<CreateBooks />} />
        <Route path="/books/details/:id" element={<ShowBooks />} />
        <Route path="/books/edit/:id" element={<UpdateBook />} />
        <Route path="/books/delete/:id" element={<DeleteBook />} />
      </Routes>
    </div>
  );
};

export default App;
