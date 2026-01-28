import express from "express";
import { Book } from "../models/bookModel.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

// save book
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res
        .status(400)
        .send({ message: "Send all req fields:title, author, publishYear" });
    }
    const newBooks = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
      summary: req.body.summary,
      // status:req.body.status,
      createdBy: req.user.id,
    };
    const book = await Book.create(newBooks);
    return res.status(201).send(book);
  } catch (error) {
    // console.log(error.message);
    next(error);
  }
});

// show all books with search and pagination
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { search, page = 1, limit = 6, status } = req.query;

    let filter = { createdBy: req.user.id };

    // filter by status (read/unread)
    if (status) {
      filter.status = status;
    }

    // search by title or author
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const total = await Book.countDocuments(filter);

    const books = await Book.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: books,
    });
  } catch (error) {
    next(error);
  }
});

//get a book by Id
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findById(id);
    if (book.createdBy.toString() !== req.user.id) {
      return res
      .status(403)
      .json({ message: "Not authorized to update this book" });
    }
    return res.status(200).json(book);
  } catch (error) {
    next(error);
    // console.log(error.message);
    // res.status(500).send({ message: error.message });
  }
});

//update a book by Id
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    if (book.createdBy.toString() !== req.user.id) {
      return res
      .status(403)
      .json({ message: "Not authorized to update this book" });
    }
    
    // 3. Update the book
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    
    return res.status(200).json({
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    next(error);
    // console.log(error.message);
    // res.status(500).json({ message: "Server error" });
  }
});

//delete a book by Id
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }
    if (book.createdBy.toString() != req.user.id) {
      return res
      .status(403)
      .send({ message: "User is not authorized to delete the book" });
    }
    
    const result = await Book.findByIdAndDelete(id);
    return res.status(200).send({ message: "Book Deleted successfully" });
  } catch (error) {
    next(error);
    // console.log(error.message);
    // res.status(500).send({ message: error.message });
  }
});

// bookmark
router.put("/:id/bookmark", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    if (book.createdBy.toString() !== req.user.id) {
      return res
      .status(403)
      .json({ message: "Not authorized to bookmark this book" });
    }
    
    book.bookmarked = !book.bookmarked;
    
    await book.save();
    
    return res.status(200).json({
      message: "Bookmark updated",
      bookmarked: book.bookmarked,
      data: book,
    });
  } catch (error) {
    next(error);
    // console.log(error.message);
    // res.status(500).json({ message: "Server error" });
  }
});

// comments
router.post("/:id/comments", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    if (book.createdBy.toString() !== req.user.id) {
      return res
      .status(403)
      .json({ message: "Not authorized to comment on this book" });
    }
    
    const newComment = {
      text: text,
      user: req.user.id,
      createdAt: new Date(),
    };
    
    book.comments.push(newComment);
    
    await book.save();
    
    return res.status(201).json({
      message: "Comment added successfully",
      data: book,
    });
  } catch (error) {
    next(error);
    // console.log(error.message);
    // res.status(500).json({ message: "Server error" });
  }
});

// delete comment
router.delete(
  "/:id/comments/:commentId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id, commentId } = req.params;
      
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      const comment = book.comments.find((c) => c._id.toString() === commentId);
      
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      // only the comment owner can delete
      if (comment.user.toString() !== req.user.id) {
        return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
      }
      
      book.comments = book.comments.filter(
        (c) => c._id.toString() !== commentId,
      );
      
      await book.save();
      
      return res.json({
        message: "Comment deleted successfully",
        data: book.comments,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;


// //get all books
// router.get("/", authMiddleware, async (req, res, next) => {
//   try {
//     const { status } = req.query;
//     const { search, page = 1, limit = 5 } = req.query;
//     let filter = { createdBy: req.user.id };

//     // if status is provided in query, add it to filter
//     if (status) {
//       filter.status = status; // "read" or "unread"
//     }
//     // return res.status(200).json(book);
//     if (search) {
//       filter.$or = [
//         { title: { $regex: search, $options: "i" } },
//         { author: { $regex: search, $options: "i" } },
//       ];
//     }

//     const skip = (Number(page) - 1) * Number(limit);

//     const books = await Book.find(filter)
//       .skip(skip)
//       .limit(Number(limit))
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / limit),
//       data: books,
//     });
//   } catch (error) {
//     next(error);
//   }
// });